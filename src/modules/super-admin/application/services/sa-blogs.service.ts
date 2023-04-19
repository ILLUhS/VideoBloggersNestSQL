import { Injectable } from '@nestjs/common';
import { Blog } from '../../../../domain/entities/blog.entity';
import { BlogsRepository } from '../../../public/infrastructure/repositories/blogs.repository';

@Injectable()
export class SaBlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async findBlogById(id: number): Promise<Blog | null> {
    return await this.blogsRepository.findById(id);
  }
}
