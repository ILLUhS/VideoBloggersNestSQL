import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BPostsService } from '../../../application/services/b-posts.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class PostIdValidator implements ValidatorConstraintInterface {
  constructor(private postsService: BPostsService) {}
  async validate(postId: number): Promise<boolean> {
    postId = Number(postId);
    if (isNaN(postId) || postId > 2147483647 || postId < -2147483648)
      throw new NotFoundException();
    const post = await this.postsService.findPostById(postId);
    if (!post) throw new NotFoundException();
    return true;
  }
  defaultMessage() {
    return `postId incorrect`;
  }
}
