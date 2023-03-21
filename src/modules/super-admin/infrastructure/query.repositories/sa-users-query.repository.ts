import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { UserViewType } from '../../../public/api/types/user.view.type';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class SaUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getUsersWithBanInfo(searchParams: QueryParamsDto) {
    let banSearch;
    switch (searchParams.banStatus) {
      case 'all':
        banSearch = 'NOT NULL';
        break;
      case 'banned':
        banSearch = 'TRUE';
        break;
      case 'notBanned':
        banSearch = 'FALSE';
        break;
      default:
        banSearch = 'NOT NULL';
    }
    const sql = format(
      `SELECT
                "Users"."id",
                "login", 
                "email", 
                "createdAt", 
                "isBanned",
                "banDate",
                "banReason"
                FROM public."Users"
                WHERE ("login" ~* %1$L
                OR "email" ~* %2$L)
                AND "isBanned" IS %5$s 
                ORDER BY %6$I %7$s
                LIMIT %3$L OFFSET %4$L;`,
      searchParams.searchLoginTerm,
      searchParams.searchEmailTerm,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      banSearch,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    const users = await this.dataSource.query(sql);
    const sqlCount = format(
      `SELECT
                COUNT(*)
                FROM public."Users"
                WHERE ("login" ~* %1$L
                OR "email" ~* %2$L)
                AND "isBanned" IS %3$s;`,
      searchParams.searchLoginTerm,
      searchParams.searchEmailTerm,
      banSearch,
    );
    const usersCount: number = (await this.dataSource.query(sqlCount))[0].count;
    return {
      pagesCount: Math.ceil(+usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: +usersCount,
      items: users.map((user) => ({
        id: String(user.id),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        banInfo: {
          isBanned: user.isBanned,
          banDate: user.banDate,
          banReason: user.banReason,
        },
      })),
    };
  }
  async findUserById(id: number): Promise<UserViewType | null> {
    const user = await this.dataSource.query(
      `SELECT
                "id",
                "login", 
                "email", 
                "createdAt", 
                "isBanned",
                "banDate",
                "banReason"
                FROM public."Users"
                WHERE "id" = $1;`,
      [id],
    );
    if (!user.length) return null;
    return {
      id: String(user[0].id),
      login: user[0].login,
      email: user[0].email,
      createdAt: user[0].createdAt,
      banInfo: {
        isBanned: user[0].isBanned,
        banDate: user[0].banDate,
        banReason: user[0].banReason,
      },
    };
  }
}
