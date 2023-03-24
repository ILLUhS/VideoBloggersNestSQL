import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogCommand } from './commands/update-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BBlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { id, blogDto } = command;
    const blog = await this.blogsRepository.findById(id);
    if (!blog) throw new NotFoundException();
    blog.updateProperties(blogDto);
    return await this.blogsRepository.update(blog);
  }
}
