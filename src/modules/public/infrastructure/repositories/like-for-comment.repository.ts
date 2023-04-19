import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeForComment } from '../../../../domain/entities/like-for-comment.entity';

@Injectable()
export class LikeForCommentRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async create(like: LikeForComment): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO public."LikeForComment"(
                "commentId", 
                "userId", 
                "reaction", 
                "createdAt")
                VALUES ($1, $2, $3, $4);`,
      [like.commentId, like.userId, like.reaction, like.createdAt],
    );
    return;
  }
  async update(like: LikeForComment): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."LikeForComment"
                SET 
                "reaction"=$3
                WHERE "commentId" = $1
                AND "userId" = $2;`,
      [like.commentId, like.userId, like.reaction],
    );
    return !!result;
  }
  async findByCommentIdIdUserId(
    postId: number,
    userId: number,
  ): Promise<LikeForComment | null> {
    const foundLike = await this.dataSource.query(
      `SELECT
                "commentId", 
                "userId", 
                "reaction", 
                "createdAt"
                FROM public."LikeForComment"
                WHERE "commentId" = $1
                AND "userId" = $2;`,
      [postId, userId],
    );
    if (!foundLike.length) return null;
    const like = new LikeForComment({
      commentId: foundLike[0].commentId,
      userId: foundLike[0].userId,
      reaction: foundLike[0].reaction,
    });
    await like.setCreatedAt(foundLike[0].createdAt);
    return like;
  }
}
