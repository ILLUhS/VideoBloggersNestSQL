import { Injectable } from '@nestjs/common';
import { Post } from '../../../../domain/schemas/post.schema';
import { PostsRepository } from '../../../public/infrastructure/repositories/posts.repository';

@Injectable()
export class BPostsService {
  constructor(private postsRepository: PostsRepository) {}

  async findPostById(id: number): Promise<Post | null> {
    return await this.postsRepository.findById(id);
  }
}
