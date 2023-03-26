import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUnbanBlogCommand } from './commands/ban-unban-blog.command';
import { BadRequestException } from '@nestjs/common';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(BanUnbanBlogCommand)
export class BanUnbanBlogUseCase
  implements ICommandHandler<BanUnbanBlogCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: BanUnbanBlogCommand): Promise<void> {
    const { blogId, isBanned } = command;
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog)
      throw new BadRequestException({
        message: [{ field: 'blogId', message: 'invalid id' }],
      });
    if (isBanned) blog.ban();
    else blog.unban();
    await this.blogsRepository.update(blog);
  }
}
