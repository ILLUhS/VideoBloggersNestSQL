import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { BPostsRepository } from '../../../infrastructure/repositories/b-posts.repository';
import { BBlogsRepository } from '../../../infrastructure/repositories/b-blogs.repository';
import { Post } from '../../../../../domain/schemas/post.schema';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BBlogsRepository,
    private postsRepository: BPostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<number> {
    const { postDto } = command;
    const currentBlog = await this.blogsRepository.findById(postDto.blogId);
    if (!currentBlog) throw new NotFoundException();
    const post = new Post(postDto);
    return await this.postsRepository.create(post);
  }
}
