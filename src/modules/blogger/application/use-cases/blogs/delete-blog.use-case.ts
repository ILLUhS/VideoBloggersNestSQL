import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBlogCommand } from './commands/delete-blog.command';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const { id } = command;
    return await this.blogsRepository.deleteById(id);
  }
}
