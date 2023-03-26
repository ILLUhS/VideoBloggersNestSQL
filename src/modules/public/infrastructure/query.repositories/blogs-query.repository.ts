import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { BlogsViewType } from '../../types/blog.view.type';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import format = require('pg-format');

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async getBlogsWithQueryParam(searchParams: QueryParamsDto) {
    const sql = format(
      `SELECT
                "id",
                "name",
                "description",
                "websiteUrl",
                "createdAt",
                "isMembership"
                FROM public."Blogs"
                WHERE "isBanned" IS FALSE
                AND "name" ~* %1$L 
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
                FROM public."Blogs"
                WHERE "isBanned" IS FALSE
                AND "name" ~* %1$L;`,
      searchParams.searchNameTerm,
    );
    const blogsCount = Number((await this.dataSource.query(sqlCount))[0].count);
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
      })),
    };
  }
  async findBlogById(id: number): Promise<BlogsViewType | null> {
    const blog = await this.dataSource.query(
      `SELECT
                "id",
                "name",
                "description",
                "websiteUrl",
                "createdAt",
                "isMembership"
                FROM public."Blogs"
                WHERE "id" = $1;`,
      [id],
    );
    if (!blog.length) return null;
    return {
      id: String(blog[0].id),
      name: blog[0].name,
      description: blog[0].description,
      websiteUrl: blog[0].websiteUrl,
      createdAt: blog[0].createdAt,
      isMembership: blog[0].isMembership,
    };
  }
  async getBlogsByUserId(searchParams: QueryParamsDto, userId: number) {
    const sql = format(
      `SELECT
                "id",
                "name",
                "description",
                "websiteUrl",
                "createdAt",
                "isMembership"
                FROM public."Blogs"
                WHERE "userId" = %1$s
                AND "name" ~* %2$L 
                ORDER BY %5$I %6$s
                LIMIT %3$L OFFSET %4$L;`,
      userId,
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
                FROM public."Blogs"
                WHERE "userId" = %1$s
                AND "name" ~* %2$L;`,
      userId,
      searchParams.searchNameTerm,
    );
    const blogsCount = Number((await this.dataSource.query(sqlCount))[0].count);
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
      })),
    };
  }
}
