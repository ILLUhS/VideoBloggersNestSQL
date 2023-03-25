import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogCommand } from './commands/update-blog.command';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { id, blogDto } = command;
    const blog = await this.blogsRepository.findById(id);
    if (!blog) throw new NotFoundException();
    blog.updateProperties(blogDto);
    return await this.blogsRepository.update(blog);
  }
}
