import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { UserViewType } from '../../../public/api/types/user.view.type';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class SaUsersQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}

  /*async getUsersWithBanInfo(searchParams: QueryParamsDto) {
    let banSearch;
    switch (searchParams.banStatus) {
      case 'all':
        banSearch = {};
        break;
      case 'banned':
        banSearch = { isBanned: true };
        break;
      case 'notBanned':
        banSearch = { isBanned: false };
        break;
      default:
        banSearch = {};
    }
    const users = await this.userModel
      .find(banSearch)
      .or([
        {
          login: {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: searchParams.searchEmailTerm,
            $options: 'i',
          },
        },
      ])
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({
        _id: 0,
        id: 1,
        login: 1,
        email: 1,
        createdAt: 1,
        isBanned: 1,
        banDate: 1,
        banReason: 1,
      })
      .exec();
    const usersCount = await this.userModel
      .countDocuments(banSearch)
      .or([
        {
          login: {
            $regex: searchParams.searchLoginTerm,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: searchParams.searchEmailTerm,
            $options: 'i',
          },
        },
      ])
      .exec();
    return {
      pagesCount: Math.ceil(usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: usersCount,
      items: users.map((user) => ({
        id: user.id,
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
  }*/
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
                JOIN (SELECT id 
                FROM public."Users" 
                ORDER BY "id"
                LIMIT %3$L OFFSET %4$L) as b 
                ON b.id = "Users"."id"
                WHERE ("login" ~* %1$L
                OR "email" ~* %2$L)
                AND "isBanned" IS %5$s
                ORDER BY %6$I %7$s;`,
      searchParams.searchLoginTerm,
      searchParams.searchEmailTerm,
      searchParams.pageSize,
      (searchParams.pageNumber - 1) * searchParams.pageSize,
      banSearch,
      searchParams.sortBy,
      searchParams.sortDirection,
    );
    /*const users = await this.dataSource.query(
      `SELECT
                "Users"."id",
                "login", 
                "email", 
                "createdAt", 
                "isBanned",
                "banDate",
                "banReason"
                FROM public."Users"
                JOIN (SELECT id 
                FROM public."Users" 
                ORDER BY "id"
                LIMIT $3 OFFSET $4) as b 
                ON b.id = "Users"."id"
                WHERE ("login" ~* $1
                OR "email" ~* $2)
                AND "isBanned" IS ${banSearch}
                ORDER BY "${searchParams.sortBy}" ${searchParams.sortDirection};`,
      [
        searchParams.searchLoginTerm,
        searchParams.searchEmailTerm,
        searchParams.pageSize,
        (searchParams.pageNumber - 1) * searchParams.pageSize,
      ],
    );*/
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
    /*const usersCount: number = (
      await this.dataSource.query(
        `SELECT
                COUNT(*)
                FROM public."Users"
                WHERE ("login" ~* $1
                OR "email" ~* $2)
                AND "isBanned" IS ${banSearch};`,
        [searchParams.searchLoginTerm, searchParams.searchEmailTerm],
      )
    )[0].count;*/
    const usersCount: number = (await this.dataSource.query(sqlCount))[0].count;
    return {
      pagesCount: Math.ceil(+usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: +usersCount,
      items: users.map((user) => ({
        id: user.id,
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

  /*async findUserById(id: string): Promise<UserViewType | null> {
    const user = await this.userModel
      .findOne({ id: id })
      .select({
        _id: 0,
        id: 1,
        login: 1,
        email: 1,
        createdAt: 1,
        isBanned: 1,
        banDate: 1,
        banReason: 1,
      })
      .exec();
    return user
      ? {
          id: user.id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
          banInfo: {
            isBanned: user.isBanned,
            banDate: user.banDate,
            banReason: user.banReason,
          },
        }
      : null;
  }*/
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
      id: user[0].id,
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
