import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUnbanBlogCommand } from './commands/ban-unban-blog.command';
import { SaBlogsRepository } from '../../../infrastructure/repositories/sa-blogs.repository';
import { BadRequestException } from '@nestjs/common';
import { PostsRepository } from '../../../../public/infrastructure/repositories/posts.repository';

@CommandHandler(BanUnbanBlogCommand)
export class BanUnbanBlogUseCase
  implements ICommandHandler<BanUnbanBlogCommand>
{
  constructor(
    private blogsRepository: SaBlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: BanUnbanBlogCommand): Promise<void> {
    const { blogId, isBanned } = command;
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog)
      throw new BadRequestException({
        message: [{ field: 'blogId', message: 'invalid id' }],
      });
    if (isBanned) blog.ban();
    else blog.unban();
    await this.blogsRepository.save(blog);
    /*const posts = await this.postsRepository.findPostsByBlogId(blogId);
    if (posts.length)
      posts.forEach((p) => {
        p.setBanStatus(isBanned);
        this.postsRepository.save(p);
      });*/
  }
}
