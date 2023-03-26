import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../../public/infrastructure/repositories/comments.repository';

@Injectable()
export class SaCommentsRepository extends CommentsRepository {
  /*async findByUserId(userId: string): Promise<CommentDocument[] | null> {
    return this.commentModel.find({ userId: userId });
  }*/
}
