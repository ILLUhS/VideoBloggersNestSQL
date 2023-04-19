import { Injectable } from '@nestjs/common';
import { Blog } from '../../../../domain/entities/blog.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  //объект с методами управления данными
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async create(blog: Blog): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."Blogs"(
                "name", 
                "description", 
                "websiteUrl", 
                "createdAt", 
                "isMembership", 
                "userId", 
                "isBanned")
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "id";`,
      [
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
        blog.userId,
        blog.isBanned,
      ],
    );
    return result[0].id;
  }
  async update(blog: Blog): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Blogs"
                SET 
                "name"=$2, 
                "description"=$3, 
                "websiteUrl"=$4, 
                "createdAt"=$5, 
                "isMembership"=$6, 
                "userId"=$7, 
                "isBanned"=$8, 
                "banDate"=$9
              WHERE "id" = $1;`,
      [
        blog.id,
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
        blog.userId,
        blog.isBanned,
        blog.banDate,
      ],
    );
    return !!result;
  }
  async findById(id: number): Promise<Blog | null> {
    const foundBlog = await this.dataSource.query(
      `SELECT
                "id",
                "name",
                "description",
                "websiteUrl",
                "createdAt",
                "isMembership",
                "userId",
                "isBanned",
                "banDate"
                FROM public."Blogs"
                WHERE "id" = $1;`,
      [id],
    );
    if (!foundBlog.length) return null;
    const blog = new Blog({
      name: foundBlog[0].name,
      description: foundBlog[0].description,
      websiteUrl: foundBlog[0].websiteUrl,
      userId: foundBlog[0].userId,
    });
    await blog.setAll(foundBlog[0]);
    return blog;
  }
  async findByUserId(userId: number): Promise<Blog[] | null> {
    const foundBlogs = await this.dataSource.query(
      `SELECT
                "id",
                "name",
                "description",
                "websiteUrl",
                "createdAt",
                "isMembership",
                "userId",
                "isBanned",
                "banDate"
                FROM public."Blogs"
                WHERE "userId" = $1;`,
      [userId],
    );
    if (!foundBlogs.length) return null;
    const blogs: Blog[] = [];
    for (const b of foundBlogs) {
      const blog = new Blog({
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        userId: b.userId,
      });
      await blog.setAll(b);
      blogs.push(blog);
    }
    return blogs;
  }
  async deleteById(id: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Blogs"
              WHERE "id" = $1
              RETURNING "id";`,
      [id],
    );
    if (!result.length) return false;
    return true;
  }
}
