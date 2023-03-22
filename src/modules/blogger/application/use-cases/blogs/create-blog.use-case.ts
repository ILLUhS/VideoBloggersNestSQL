import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from './commands/create-blog.command';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../../../../domain/schemas/blog.schema';

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private blogsRepository: BBlogsRepository,
  ) {}
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
