import { Injectable } from '@nestjs/common';
import { BPostsRepository } from '../../infrastructure/repositories/b-posts.repository';
import { Post } from '../../../../domain/schemas/post.schema';

@Injectable()
export class BPostsService {
  constructor(private postsRepository: BPostsRepository) {}

  async findPostById(id: number): Promise<Post | null> {
    return await this.postsRepository.findById(id);
  }
}
