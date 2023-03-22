import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelType,
} from '../../../../domain/schemas/blog.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BBlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Blog.name) private blogModel: BlogModelType,
  ) {}

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
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id";`,
      [
        blog.name,
        blog.description,
        blog.createdAt,
        blog.createdAt,
        blog.isMembership,
        blog.userId,
        blog.isBanned,
      ],
    );
    return result[0].id;
  }
  async findById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ id: id });
  }
  async findByUserId(userId: string): Promise<BlogDocument[] | null> {
    return this.blogModel.find({ userId: userId }).exec();
  }
  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.blogModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.blogModel.deleteMany().exec()).acknowledged;
  }
  async save(blog: BlogDocument): Promise<boolean> {
    return !!(await blog.save());
  }
}
