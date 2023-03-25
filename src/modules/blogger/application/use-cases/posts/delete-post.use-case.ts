import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './commands/delete-post.command';
import { BBlogsService } from '../../services/b-blogs.service';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../../public/infrastructure/repositories/posts.repository';

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private blogsService: BBlogsService,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { postId, blogId } = command.BlogIdPostIdDto;
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return await this.postsRepository.deleteById(postId);
  }
}
