import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDislikeForCommentCommand } from './commands/create-like-dislike-for-comment.command';
import { LikeForCommentRepository } from '../../../infrastructure/repositories/like-for-comment.repository';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LikeForComment } from '../../../../../domain/schemas/like-for-comment.schema';

@CommandHandler(CreateLikeDislikeForCommentCommand)
export class CreateLikeDislikeForCommentUseCase
  implements ICommandHandler<CreateLikeDislikeForCommentCommand>
{
  constructor(
    private commentRepository: CommentsRepository,
    private likeForCommentRepository: LikeForCommentRepository,
  ) {}

  async execute(command: CreateLikeDislikeForCommentCommand): Promise<void> {
    const { commentId, reaction, userId } = command.reactionDto;
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException();
    let like = await this.likeForCommentRepository.findByCommentIdIdUserId(
      commentId,
      userId,
    );
    if (!like) {
      like = new LikeForComment({ commentId, userId, reaction });
      return await this.likeForCommentRepository.create(like);
    }
    if (!(await like.setReaction(reaction)))
      throw new BadRequestException({
        message: [
          {
            field: 'likeStatus',
            message: 'bad value',
          },
        ],
      });
    await this.likeForCommentRepository.update(like);
    return;
  }
}
