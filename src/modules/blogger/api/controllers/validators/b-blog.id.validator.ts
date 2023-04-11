import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BBlogsService } from '../../../application/services/b-blogs.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BBlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogsService: BBlogsService) {}

  async validate(blogId: number): Promise<boolean> {
    blogId = Number(blogId);
    if (isNaN(blogId) || blogId > 2147483647 || blogId < -2147483648)
      throw new NotFoundException();
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
