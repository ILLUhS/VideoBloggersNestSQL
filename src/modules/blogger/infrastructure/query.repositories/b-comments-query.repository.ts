import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { QueryMapHelpers } from '../../../public/infrastructure/query-map.helpers';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class BCommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected queryMap: QueryMapHelpers,
  ) {}
  async getCommentsByBlog(searchParams: QueryParamsDto, userId: number) {
    const sql = format(
      `SELECT
                c."id",
                c."content",
                c."userId",
                u."login",
                c."createdAt",
                "Blogs"."id" as "blogId",
                "Blogs"."name" as "blogName",
                "Posts"."id" as "postId",
                "Posts"."title" as "postTitle",
                JSONB_AGG
                (
                    JSON_BUILD_OBJECT
                    (
                     'reaction', l."reaction",
                     'userId', l."id",
                     'login', l."login",
                     'createdAt', l."createdAt"
                    )
                ) AS "reactions"
            FROM "Comments" as c
            JOIN "Posts" ON c."postId" = "Posts"."id"
            JOIN "Blogs" ON "Posts"."blogId" = "Blogs"."id"
            JOIN (
                    SELECT
                    "Users"."id",
                    "Users"."login"
                    FROM "Users") as u ON c."userId" = u."id"
            LEFT JOIN (
                    SELECT
                        "LikeForComment"."reaction",
                        "LikeForComment"."commentId",
                        "Users"."id",
                        "Users"."login",
                        "Users"."createdAt"
                    FROM public."LikeForComment"
                    JOIN "Users" ON "LikeForComment"."userId" = "Users"."id"
                        AND "Users"."isBanned" IS FALSE) as l
            ON l."commentId" = c."id"
            WHERE "Blogs"."userId" = %1$s
            GROUP BY c."id",
                c."content",
                c."userId",
                u."login",
                c."createdAt",
                "Blogs"."id",
                "Blogs"."name",
                "Posts"."id",
                "Posts"."title"
            ORDER BY %4$I %5$s
            LIMIT %2$L OFFSET %3$L;`,
      userId,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    const comments = await this.dataSource.query(sql);
    const sqlCount = format(
      `SELECT
                COUNT(*)
                FROM "Comments" as c
                JOIN "Posts" ON c."postId" = "Posts"."id"
                JOIN "Blogs" ON "Posts"."blogId" = "Blogs"."id"
                WHERE "Blogs"."userId" = %1$s;`,
      userId,
    );
    const commentsCount: number = (await this.dataSource.query(sqlCount))[0]
      .count;
    return {
      pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: Number(commentsCount),
      items: await Promise.all(
        comments.map(async (c) => {
          const likesInfoMapped = await this.queryMap.likesInfoMap(
            c.reactions,
            userId,
          );
          return {
            id: String(c.id),
            content: c.content,
            createdAt: c.createdAt,
            commentatorInfo: {
              userId: String(c.userId),
              userLogin: c.login,
            },
            likesInfo: likesInfoMapped,
            postInfo: {
              id: String(c.postId),
              title: c.postTitle,
              blogId: String(c.blogId),
              blogName: c.blogName,
            },
          };
        }),
      ),
    };
  }
}
