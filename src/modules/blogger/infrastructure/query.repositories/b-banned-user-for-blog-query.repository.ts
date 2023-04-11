import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import format = require('pg-format');

@Injectable()
export class BBannedUserForBlogQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async getBanUsersByBlogId(searchParams: QueryParamsDto, blogId: number) {
    const sql = format(
      `SELECT
                b."id",
                "blogId",
                "userId",
                b."isBanned",
                b."banDate",
                b."banReason",
                "login"
                FROM public."BannedUsersForBlog" as b
                INNER JOIN (
                SELECT "id", "login"
                FROM public."Users"
                WHERE "login" ~* %2$L) as u
                ON u.id = b."userId"
                WHERE "blogId" = %1$s
                AND "isBanned" IS TRUE 
                ORDER BY %5$I %6$s
                LIMIT %3$L OFFSET %4$L;`,
      blogId,
      searchParams.searchLoginTerm,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    const users = await this.dataSource.query(sql);
    const sqlCount = format(
      `SELECT
                COUNT(*)
                FROM public."BannedUsersForBlog" as b
                INNER JOIN (
                SELECT "id", "login"
                FROM public."Users"
                WHERE "login" ~* %2$L) as u
                ON u.id = b."userId"
                WHERE "blogId" = %1$s
                AND "isBanned" IS TRUE;`,
      blogId,
      searchParams.searchLoginTerm,
    );
    const usersCount: number = (await this.dataSource.query(sqlCount))[0].count;
    return {
      pagesCount: Math.ceil(usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: Number(usersCount),
      items: users.map((u) => ({
        id: String(u.id),
        login: u.login,
        banInfo: {
          isBanned: u.isBanned,
          banDate: u.banDate,
          banReason: u.banReason,
        },
      })),
    };
  }
}
