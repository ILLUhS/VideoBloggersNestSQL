import { Validate } from 'class-validator';
import { BlogIdValidator } from '../../../super-admin/api/validators/blog.id.validator';
import { PostIdValidator } from '../controllers/validators/post-id.validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BlogIdPostIdInputDto {
  @Transform(({ value }: TransformFnParams) => Number(value))
  @Validate(BlogIdValidator)
  blogId: number;

  @Transform(({ value }: TransformFnParams) => Number(value))
  @Validate(PostIdValidator)
  postId: number;
}
