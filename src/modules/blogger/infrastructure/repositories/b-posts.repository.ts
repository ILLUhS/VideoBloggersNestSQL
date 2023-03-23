import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../../../domain/schemas/post.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BPostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Post.name) private postModel: PostModelType,
  ) {}
  async create(post: Post): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."Post"(
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                "createdAt")
                VALUES ($1, $2, $3, $4, $5) RETURNING "id";`,
      [
        post.title,
        post.shortDescription,
        post.content,
        post.blogId,
        post.createdAt,
      ],
    );
    return result[0].id;
  }
  async deleteById(id: string): Promise<boolean> {
    return (
      (await this.postModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }
  async deleteAll(): Promise<boolean> {
    return (await this.postModel.deleteMany().exec()).acknowledged;
  }
  async findById(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ id: id });
  }
  async save(post: PostDocument): Promise<boolean> {
    return !!(await post.save());
  }
  async findPostsByBlogId(blogId: string): Promise<PostDocument[] | null> {
    return this.postModel.find({ blogId: blogId });
  }
}
