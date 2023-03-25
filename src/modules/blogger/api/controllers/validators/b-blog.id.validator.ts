import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BBlogsService } from '../../../application/services/b-blogs.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BBlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogsService: BBlogsService) {}

  async validate(blogId: number): Promise<boolean> {
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog)
      throw new BadRequestException({
        message: [
          {
            field: 'blogId',
            message: 'incorrect blog id',
          },
        ],
      });
    return true;
  }
  defaultMessage() {
    return `blogId incorrect`;
  }
}
