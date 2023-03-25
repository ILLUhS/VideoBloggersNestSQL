import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { Post } from '../../../../../domain/schemas/post.schema';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../../public/infrastructure/repositories/posts.repository';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<number> {
    const { postDto } = command;
    const currentBlog = await this.blogsRepository.findById(postDto.blogId);
    if (!currentBlog) throw new NotFoundException();
    const post = new Post(postDto);
    return await this.postsRepository.create(post);
  }
}
