import { Injectable } from '@nestjs/common';
import { Blog } from '../../../../domain/schemas/blog.schema';
import { BlogsRepository } from '../../../public/infrastructure/repositories/blogs.repository';

@Injectable()
export class BBlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async findBlogById(id: number): Promise<Blog | null> {
    return await this.blogsRepository.findById(id);
  }
}
