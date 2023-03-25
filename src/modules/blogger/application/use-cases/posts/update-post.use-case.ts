import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './commands/update-post.command';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../../public/infrastructure/repositories/posts.repository';
import { BlogsRepository } from '../../../../public/infrastructure/repositories/blogs.repository';

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { blogIdPostIdDto, postDto } = command;
    const foundBlog = await this.blogsRepository.findById(
      blogIdPostIdDto.blogId,
    );
    if (!foundBlog) throw new NotFoundException();
    const post = await this.postsRepository.findById(blogIdPostIdDto.postId);
    if (!post) throw new NotFoundException();
    post.updateProperties(postDto);
    return await this.postsRepository.update(post);
  }
}
