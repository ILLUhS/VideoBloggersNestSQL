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
  async update(post: Post): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Post"
                SET 
                "title"=$2, 
                "shortDescription"=$3, 
                "content"=$4, 
                "blogId"=$5, 
                "createdAt"=$6
              WHERE "id" = $1;`,
      [
        post.id,
        post.title,
        post.shortDescription,
        post.content,
        post.blogId,
        post.createdAt,
      ],
    );
    return !!result;
  }
  async findById(id: number): Promise<Post | null> {
    const foundPost = await this.dataSource.query(
      `SELECT
                "id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                "createdAt"
                FROM public."Post"
                WHERE "id" = $1;`,
      [id],
    );
    if (!foundPost.length) return null;
    const post = new Post({
      title: foundPost[0].title,
      shortDescription: foundPost[0].shortDescription,
      content: foundPost[0].content,
      blogId: foundPost[0].blogId,
    });
    await post.setAll(foundPost[0]);
    return post;
  }
  async findPostsByBlogId(blogId: number): Promise<Post[] | null> {
    const foundPosts = await this.dataSource.query(
      `SELECT
                "id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                "createdAt"
                FROM public."Post"
                WHERE "blogId" = $1;`,
      [blogId],
    );
    if (!foundPosts.length) return null;
    const posts: Post[] = [];
    for (const p of foundPosts) {
      const post = new Post({
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
      });
      await post.setAll(p);
      posts.push(post);
    }
    return posts;
  }
  async deleteById(id: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Post"
              WHERE "id" = $1
              RETURNING "id";`,
      [id],
    );
    if (!result.length) return false;
    return true;
  }
  /*async deleteById(id: string): Promise<boolean> {
    return (
      (await this.postModel.deleteOne({ id: id }).exec()).deletedCount === 1
    );
  }*/
  async deleteAll(): Promise<boolean> {
    return (await this.postModel.deleteMany().exec()).acknowledged;
  }
  async save(post: PostDocument): Promise<boolean> {
    return !!(await post.save());
  }
  /*async findPostsByBlogId(blogId: string): Promise<PostDocument[] | null> {
    return this.postModel.find({ blogId: blogId });
  }*/
}
