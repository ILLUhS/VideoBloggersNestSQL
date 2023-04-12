import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { QueryMapHelpers } from '../query-map.helpers';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected queryMap: QueryMapHelpers,
  ) {}
  async findPostById(id: number, userId: number = null) {
    const sql = format(
      `SELECT
                p."id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                p."createdAt",
                b."name" as "blogName",
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
            FROM "Posts" as p
            JOIN (
                    SELECT 
                    "Blogs"."id",
                    "Blogs"."isBanned",
                    "Blogs"."name"
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id" 
                    AND "Users"."isBanned" IS FALSE) as b
            ON p."blogId" = b."id"
            LEFT JOIN (
                    SELECT 
                        "LikeForPost"."reaction",
                        "LikeForPost"."postId",
                        "Users"."id",
                        "Users"."login",
                        "Users"."createdAt"
                    FROM public."LikeForPost"
                    JOIN "Users" ON "LikeForPost"."userId" = "Users"."id" 
                        AND "Users"."isBanned" IS FALSE) as l
            ON l."postId" = p."id"
            WHERE b."isBanned" IS FALSE
            AND p."id" = %1$s
            GROUP BY p."id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                p."createdAt",
                b."name";`,
      id,
    );
    const post = await this.dataSource.query(sql);
    if (!post.length) return null;
    const likesInfoMapped = await this.queryMap.likesInfoMap(
      post[0].reactions,
      userId,
    );
    const newestLikesMapped = await this.queryMap.newestLikesMap([
      ...post[0].reactions,
    ]);
    return {
      id: String(post[0].id),
      title: post[0].title,
      shortDescription: post[0].shortDescription,
      content: post[0].content,
      blogId: String(post[0].blogId),
      blogName: post[0].blogName,
      createdAt: post[0].createdAt,
      extendedLikesInfo: {
        likesCount: likesInfoMapped.likesCount,
        dislikesCount: likesInfoMapped.dislikesCount,
        myStatus: likesInfoMapped.myStatus,
        newestLikes: newestLikesMapped,
      },
    };
  }
  async getPotsWithQueryParam(
    searchParams: QueryParamsDto,
    blogId?: number,
    userId: number = null, //установка дефолтного значения,
  ) {
    let condition = ``;
    if (blogId) condition = `WHERE "Blogs"."id" = ${blogId}`;
    const sql = format(
      `SELECT
                p."id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                p."createdAt",
                b."name" as "blogName",
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
            FROM "Posts" as p
            JOIN (
                    SELECT 
                    "Blogs"."id",
                    "Blogs"."isBanned",
                    "Blogs"."name" 
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id" 
                    AND "Users"."isBanned" IS FALSE
                    %1$s) as b 
            ON p."blogId" = b."id"
            LEFT JOIN (
                    SELECT 
                        "LikeForPost"."reaction",
                        "LikeForPost"."postId",
                        "LikeForPost"."createdAt",
                        "Users"."id",
                        "Users"."login"
                    FROM public."LikeForPost"
                    JOIN "Users" ON "LikeForPost"."userId" = "Users"."id" 
                        AND "Users"."isBanned" IS FALSE) as l
            ON l."postId" = p."id"
            WHERE b."isBanned" IS FALSE
            GROUP BY p."id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                p."createdAt",
                b."name"
            ORDER BY %4$I %5$s
            LIMIT %2$L OFFSET %3$L;`,
      condition,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    const posts = await this.dataSource.query(sql);
    const sqlCount = format(
      `SELECT
                COUNT(*)
                FROM "Posts" as p
                JOIN (
                    SELECT 
                    "Blogs"."id",
                    "Blogs"."isBanned" 
                    FROM public."Blogs"
                    JOIN "Users" ON "Blogs"."userId" = "Users"."id" 
                    AND "Users"."isBanned" IS FALSE
                    %1$s) as b 
                ON p."blogId" = b."id"
                WHERE b."isBanned" IS FALSE;`,
      condition,
    );
    const postsCount: number = (await this.dataSource.query(sqlCount))[0].count;
    return {
      pagesCount: Math.ceil(postsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: +postsCount,
      items: await Promise.all(
        posts.map(async (post) => {
          const likesInfoMapped = await this.queryMap.likesInfoMap(
            post.reactions,
            userId,
          );
          const newestLikesMapped = await this.queryMap.newestLikesMap([
            ...post.reactions,
          ]);
          return {
            id: String(post.id),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: String(post.blogId),
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
              likesCount: likesInfoMapped.likesCount,
              dislikesCount: likesInfoMapped.dislikesCount,
              myStatus: likesInfoMapped.myStatus,
              newestLikes: newestLikesMapped,
            },
          };
        }),
      ),
    };
  }
}
