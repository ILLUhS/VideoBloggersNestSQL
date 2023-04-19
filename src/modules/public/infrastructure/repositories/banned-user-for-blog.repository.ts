import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BannedUserForBlog } from '../../../../domain/entities/banned-user-for-blog.schema';

@Injectable()
export class BannedUserForBlogRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(user: BannedUserForBlog): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."BannedUsersForBlog"(
                "blogId", 
                "userId", 
                "isBanned", 
                "banDate", 
                "banReason")
                VALUES ($1, $2, $3, $4, $5) RETURNING "id";`,
      [user.blogId, user.userId, user.isBanned, user.banDate, user.banReason],
    );
    return result[0].id;
  }
  async update(user: BannedUserForBlog): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."BannedUsersForBlog"
                SET 
                "blogId"=$2, 
                "userId"=$3, 
                "isBanned"=$4, 
                "banDate"=$5, 
                "banReason"=$6
              WHERE "id" = $1;`,
      [
        user.id,
        user.blogId,
        user.userId,
        user.isBanned,
        user.banDate,
        user.banReason,
      ],
    );
    return !!result;
  }
  async findByBlogIdUserId(
    blogId: number,
    userId: number,
  ): Promise<BannedUserForBlog | null> {
    const foundUser = await this.dataSource.query(
      `SELECT
                "id",
                "blogId", 
                "userId", 
                "isBanned", 
                "banDate", 
                "banReason"
                FROM public."BannedUsersForBlog"
                WHERE "blogId" = $1
                AND "userId" = $2;`,
      [blogId, userId],
    );
    if (!foundUser.length) return null;
    const user = new BannedUserForBlog(blogId, userId);
    await user.setAll(foundUser[0]);
    return user;
  }
}
