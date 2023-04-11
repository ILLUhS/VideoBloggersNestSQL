import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SaBlogsService } from '../../application/services/sa-blogs.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogsService: SaBlogsService) {}

  async validate(blogId: number): Promise<boolean> {
    blogId = Number(blogId);
    if (isNaN(blogId) || blogId > 2147483647 || blogId < -2147483648)
      throw new NotFoundException();
    const foundBlogId = await this.blogsService.findBlogById(blogId);
    if (!foundBlogId) throw new NotFoundException();
    return true;
  }
  defaultMessage() {
    return 'blogId incorrect';
  }
}
