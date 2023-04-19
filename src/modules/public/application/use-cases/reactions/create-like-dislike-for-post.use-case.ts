import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDislikeForPostCommand } from './commands/create-like-dislike-for-post.command';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LikeForPostRepository } from '../../../infrastructure/repositories/like-for-post.repository';
import { LikeForPost } from '../../../../../domain/entities/like-for-post.entity';

@CommandHandler(CreateLikeDislikeForPostCommand)
export class CreateLikeDislikeForPostUseCase
  implements ICommandHandler<CreateLikeDislikeForPostCommand>
{
  constructor(
    private postRepository: PostsRepository,
    private likeForPostRepository: LikeForPostRepository,
  ) {}

  async execute(command: CreateLikeDislikeForPostCommand): Promise<void> {
    const { postId, reaction, userId } = command.reactionDto;
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException();
    let like = await this.likeForPostRepository.findByPostIdUserId(
      postId,
      userId,
    );
    if (!like) {
      like = new LikeForPost({ postId, userId, reaction });
      return await this.likeForPostRepository.create(like);
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
    await this.likeForPostRepository.update(like);
    return;
  }
}
