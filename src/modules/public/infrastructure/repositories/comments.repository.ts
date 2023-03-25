import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentModelType,
} from '../../../../domain/schemas/comment.schema';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Comment.name) protected commentModel: CommentModelType,
  ) {}
  async create(comment: Comment): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."Comments"(
                "content", 
                "userId", 
                "postId", 
                "createdAt")
                VALUES ($1, $2, $3, $4) RETURNING "id";`,
      [comment.content, comment.userId, comment.postId, comment.createdAt],
    );
    return result[0].id;
  }
  async update(comment: Comment): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Comments"
                SET 
                "content"=$2, 
                "userId"=$3, 
                "postId"=$4, 
                "createdAt"=$5
              WHERE "id" = $1;`,
      [
        comment.id,
        comment.content,
        comment.userId,
        comment.postId,
        comment.createdAt,
      ],
    );
    return !!result;
  }
  async findById(id: number): Promise<Comment | null> {
    const foundComment = await this.dataSource.query(
      `SELECT
                "id",
                "content", 
                "userId", 
                "postId", 
                "createdAt"
                FROM public."Comments"
                WHERE "id" = $1;`,
      [id],
    );
    if (!foundComment.length) return null;
    const comment = new Comment({
      content: foundComment[0].content,
      userId: foundComment[0].userId,
      postId: foundComment[0].postId,
    });
    await comment.setAll(foundComment[0]);
    return comment;
  }
  async deleteById(id: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Comments"
              WHERE "id" = $1
              RETURNING "id";`,
      [id],
    );
    if (!result.length) return false;
    return true;
  }
}
