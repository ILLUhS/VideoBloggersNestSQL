import { Validate } from 'class-validator';
import { UserIdValidator } from '../validators/user-id.validator';
import { BlogIdValidator } from '../validators/blog.id.validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BlogIdAndUserIdInputDto {
  @Transform(({ value }: TransformFnParams) => Number(value))
  @Validate(BlogIdValidator)
  id: number;

  @Transform(({ value }: TransformFnParams) => Number(value))
  @Validate(UserIdValidator)
  userId: number;
}
