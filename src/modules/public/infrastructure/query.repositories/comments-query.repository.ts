import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { QueryMapHelpers } from '../query-map.helpers';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected queryMap: QueryMapHelpers,
  ) {}
  async getCommentsWithQueryParam(
    searchParams: QueryParamsDto,
    postId: number,
    userId: number = null,
  ) {
    const sql = format(
      `SELECT
                c."id",
                c."content",
                c."userId",
                u."login",
                c."createdAt",
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
            JOIN (
                    SELECT
                    "Blogs"."id",
                    "Blogs"."isBanned",
                    "Posts"."id" as "postId"
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id"
                    AND "Users"."isBanned" IS FALSE
                    JOIN "Posts" ON "Blogs"."id" = "Posts"."blogId") as b
            ON c."postId" = b."postId"
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
            WHERE b."isBanned" IS FALSE
            AND c."postId" = %1$s
            GROUP BY c."id",
                c."content",
                c."userId",
                u."login",
                c."createdAt"
            ORDER BY %4$I %5$s
            LIMIT %2$L OFFSET %3$L;`,
      postId,
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
                JOIN (
                    SELECT
                    "Blogs"."id",
                    "Blogs"."isBanned",
                    "Posts"."id" as "postId"
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id"
                    AND "Users"."isBanned" IS FALSE
                    JOIN "Posts" ON "Blogs"."id" = "Posts"."blogId") as b
                ON c."postId" = b."postId"
                WHERE b."isBanned" IS FALSE
                AND c."postId" = %1$s;`,
      postId,
    );
    const commentsCount: number = (await this.dataSource.query(sqlCount))[0]
      .count;
    return {
      pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: Number(commentsCount),
      items: await Promise.all(
        comments.map(async (comment) => {
          const likesInfoMapped = await this.queryMap.likesInfoMap(
            comment.reactions,
            userId,
          );
          return {
            id: String(comment.id),
            content: comment.content,
            commentatorInfo: {
              userId: String(comment.userId),
              userLogin: comment.login,
            },
            createdAt: comment.createdAt,
            likesInfo: likesInfoMapped,
          };
        }),
      ),
    };
  }
  async findCommentById(id: number, userId: number = null) {
    const sql = format(
      `SELECT
                c."id",
                c."content", 
                c."userId", 
                u."login", 
                c."createdAt",
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
            JOIN (
                    SELECT 
                    "Blogs"."id",
                    "Blogs"."isBanned",
                    "Posts"."id" as "postId"
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id" 
                    AND "Users"."isBanned" IS FALSE
                    JOIN "Posts" ON "Blogs"."id" = "Posts"."blogId") as b
            ON c."postId" = b."postId"
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
            WHERE b."isBanned" IS FALSE
            AND c."id" = %1$s
            GROUP BY c."id",
                c."content", 
                c."userId", 
                u."login", 
                c."createdAt";`,
      id,
    );
    const comment = await this.dataSource.query(sql);
    if (!comment.length) return null;
    const likesInfoMapped = await this.queryMap.likesInfoMap(
      comment[0].reactions,
      userId,
    );
    return {
      id: String(comment[0].id),
      content: comment[0].content,
      commentatorInfo: {
        userId: String(comment[0].userId),
        userLogin: comment[0].login,
      },
      createdAt: comment[0].createdAt,
      likesInfo: likesInfoMapped,
    };
  }
}
