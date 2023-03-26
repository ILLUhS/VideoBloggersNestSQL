import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../api/dto/query-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../domain/schemas/blog.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class SaBlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Blog.name) private blogModel: BlogModelType,
  ) {}
  async getBlogsWithOwnerInfo(searchParams: QueryParamsDto) {
    const sql = format(
      `SELECT
                b."id",
                "name", 
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
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: blog.login,
        },
        banInfo: {
          isBanned: blog.isBanned,
          banDate: blog.banDate,
        },
      })),
    };
  }
  /*async getBlogsWithOwnerInfo(searchParams: QueryParamsDto) {
    const blogs = await this.blogModel
      .find({
        name: { $regex: searchParams.searchNameTerm, $options: 'i' },
      })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({
        _id: 0,
        __v: 0,
      })
      .exec();
    const blogsCount = await this.blogModel
      .countDocuments()
      .where('name')
      .regex(new RegExp(searchParams.searchNameTerm, 'i'))
      .exec();
    return {
      pagesCount: Math.ceil(blogsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: blogsCount,
      items: blogs.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: blog.userLogin,
        },
        banInfo: {
          isBanned: blog.isBanned,
          banDate: blog.banDate,
        },
      })),
    };
  }*/
}
