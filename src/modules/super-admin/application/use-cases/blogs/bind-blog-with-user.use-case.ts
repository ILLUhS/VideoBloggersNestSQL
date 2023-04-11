import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from './commands/bind-blog-with-user.command';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../../../auth/ifrastructure/repositories/users.repository';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: BindBlogWithUserCommand): Promise<void> {
    const { blogId, userId } = command;
    const user = await this.usersRepository.findOneByField('id', userId);
    const blog = await this.blogsRepository.findById(blogId);
    if (!user || !blog)
      throw new BadRequestException({
        message: [{ field: 'blogId or userId', message: 'invalid id' }],
      });
    if (blog.userId)
      throw new BadRequestException({
        message: [
          { field: 'blogId', message: 'blog already bound to any user' },
        ],
      });
    blog.setOwner(user.id);
    await this.blogsRepository.update(blog);
  }
}
