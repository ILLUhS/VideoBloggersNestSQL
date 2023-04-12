import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class SaBlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async getBlogsWithOwnerInfo(searchParams: QueryParamsDto) {
    const sql = format(
      `SELECT
                b."id",
                "name" COLLATE "POSIX", 
                "description", 
                "websiteUrl", 
                "createdAt", 
                "isMembership",
                "userId",
                b."isBanned",
                b."banDate",
                "login"
                FROM public."Blogs" as b
                LEFT JOIN (
                SELECT "id", "login"
                FROM public."Users") as u
                ON u.id = b."userId"
                WHERE "name" ~* %1$L
                ORDER BY %4$I %5$s
                LIMIT %2$L OFFSET %3$L;`,
      searchParams.searchNameTerm,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    const blogs = await this.dataSource.query(sql);
    const sqlCount = format(
      `SELECT
                COUNT(*)
                FROM public."Blogs" as b
                LEFT JOIN (
                SELECT "id", "login"
                FROM public."Users") as u
                ON u.id = b."userId"
                WHERE "name" ~* %1$L;`,
      searchParams.searchNameTerm,
    );
    const blogsCount: number = (await this.dataSource.query(sqlCount))[0].count;
    return {
      pagesCount: Math.ceil(blogsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: Number(blogsCount),
      items: blogs.map((blog) => ({
        id: String(blog.id),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: String(blog.userId),
          userLogin: blog.login,
        },
        banInfo: {
          isBanned: blog.isBanned,
          banDate: blog.banDate,
        },
      })),
    };
  }
}
