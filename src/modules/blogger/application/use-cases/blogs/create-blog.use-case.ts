import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from './commands/create-blog.command';
import { Blog } from '../../../../../domain/schemas/blog.schema';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: CreateBlogCommand): Promise<number> {
    const { blogDto, userId } = command;
    const blog = new Blog({
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      userId: userId,
    });
    return await this.blogsRepository.create(blog);
  }
}
