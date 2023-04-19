import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogCommand } from './commands/ban-user-for-blog.command';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BannedUserForBlogRepository } from '../../../../public/infrastructure/repositories/banned-user-for-blog.repository';
import { BannedUserForBlog } from '../../../../../domain/entities/banned-user-for-blog.entity';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';
import { UsersRepository } from '../../../../auth/ifrastructure/repositories/users.repository';

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase
  implements ICommandHandler<BanUserForBlogCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
    private bannedUserForBlogRepository: BannedUserForBlogRepository,
  ) {}

  async execute(command: BanUserForBlogCommand): Promise<void> {
    const { userId, bloggerId, banDto } = command;
    const blogsByUser = await this.blogsRepository.findByUserId(bloggerId);
    if (!blogsByUser) throw new ForbiddenException();
    const foundBlog = blogsByUser.find((b) => b.id === banDto.blogId);
    if (!foundBlog) throw new ForbiddenException();
    const bannedUser = await this.usersRepository.findOneByField('id', userId);
    if (!bannedUser) throw new NotFoundException();
    let banUserForBlog =
      await this.bannedUserForBlogRepository.findByBlogIdUserId(
        banDto.blogId,
        userId,
      );
    if (!banUserForBlog) {
      banUserForBlog = new BannedUserForBlog(banDto.blogId, userId);
      banUserForBlog.id = await this.bannedUserForBlogRepository.create(
        banUserForBlog,
      );
    }
    if (banDto.isBanned) banUserForBlog.banUser(banDto.banReason);
    else banUserForBlog.unbanUser();
    await this.bannedUserForBlogRepository.update(banUserForBlog);
    return;
  }
}
