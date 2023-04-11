import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentsRepository) {}

  async findComment(id: number): Promise<number | null> {
    const comment = await this.commentRepository.findById(id);
    return comment ? comment.userId : null;
  }
}
