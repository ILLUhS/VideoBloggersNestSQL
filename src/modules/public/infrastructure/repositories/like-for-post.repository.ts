import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeForPost } from '../../../../domain/entities/like-for-post.schema';

@Injectable()
export class LikeForPostRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async create(like: LikeForPost): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO public."LikeForPost"(
                "postId", 
                "userId", 
                "reaction", 
                "createdAt")
                VALUES ($1, $2, $3, $4);`,
      [like.postId, like.userId, like.reaction, like.createdAt],
    );
    return;
  }
  async update(like: LikeForPost): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."LikeForPost"
                SET 
                "reaction"=$3
                WHERE "postId" = $1
                AND "userId" = $2;`,
      [like.postId, like.userId, like.reaction],
    );
    return !!result;
  }
  async findByPostIdUserId(
    postId: number,
    userId: number,
  ): Promise<LikeForPost | null> {
    const foundLike = await this.dataSource.query(
      `SELECT
                "postId", 
                "userId", 
                "reaction", 
                "createdAt"
                FROM public."LikeForPost"
                WHERE "postId" = $1
                AND "userId" = $2;`,
      [postId, userId],
    );
    if (!foundLike.length) return null;
    const like = new LikeForPost({
      postId: foundLike[0].postId,
      userId: foundLike[0].userId,
      reaction: foundLike[0].reaction,
    });
    await like.setCreatedAt(foundLike[0].createdAt);
    return like;
  }
}
