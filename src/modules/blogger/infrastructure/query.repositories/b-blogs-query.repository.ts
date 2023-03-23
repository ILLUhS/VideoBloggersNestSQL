import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { BlogsQueryRepository } from '../../../public/infrastructure/query.repositories/blogs-query.repository';
import format = require('pg-format');

@Injectable()
export class BBlogsQueryRepository extends BlogsQueryRepository {
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
  async getBanUsersByBlogId(searchParams: QueryParamsDto, blogId: string) {
    //ищем блог
    const blog = await this.blogModel.findOne({ id: blogId }).exec();
    //берём массив забаниных пользователей
    let bannedUsers = blog.bannedUsers.filter(
      (b) =>
        b.isBanned === true &&
        b.login.match(new RegExp(searchParams.searchLoginTerm, 'i')),
    );
    const usersCount = bannedUsers.length;
    //сортировка
    if (searchParams.sortBy === 'createdAt') searchParams.sortBy = 'banDate';
    bannedUsers.sort((a, b) => {
      const elemA: string = a[searchParams.sortBy];
      const elemB: string = b[searchParams.sortBy];
      let result;
      if (elemA < elemB) result = -1;
      else if (elemA > elemB) result = 1;
      else result = 0;
      if (searchParams.sortDirection === 'desc') result = -result;
      return result;
    });
    //первый элемент на странице
    const firstIndex = (searchParams.pageNumber - 1) * searchParams.pageSize;
    //последний элемент на странице
    const lastIndex = firstIndex + searchParams.pageSize;
    //берём нужную часть массива
    bannedUsers = bannedUsers.slice(firstIndex, lastIndex);

    return {
      pagesCount: Math.ceil(usersCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: usersCount,
      items: bannedUsers.map((u) => ({
        id: u.id,
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
