import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './commands/create-comment.command';
import { CommentsRepository } from '../../../infrastructure/repositories/comments.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../infrastructure/repositories/posts.repository';
import { BannedUserForBlogRepository } from '../../../infrastructure/repositories/banned-user-for-blog.repository';
import { Comment } from '../../../../../domain/schemas/comment.schema';

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private postRepository: PostsRepository,
    private bannedUserForBlogRepository: BannedUserForBlogRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<number> {
    const { commentDto } = command;
    const post = await this.postRepository.findById(commentDto.postId);
    if (!post) throw new NotFoundException();
    const userIsBanned =
      await this.bannedUserForBlogRepository.findByBlogIdUserId(
        post.blogId,
        commentDto.userId,
      );
    if (userIsBanned) throw new ForbiddenException();
    const comment = new Comment(commentDto);
    return await this.commentsRepository.create(comment);
  }
}
