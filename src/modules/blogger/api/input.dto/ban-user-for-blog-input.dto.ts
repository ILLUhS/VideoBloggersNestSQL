import { BanUserInputDto } from '../../../super-admin/api/dto/ban-user-input.dto';
import { Validate } from 'class-validator';
import { BBlogIdValidator } from '../controllers/validators/b-blog.id.validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BanUserForBlogInputDto extends BanUserInputDto {
  //@IsUUID(4)
  @Transform(({ value }: TransformFnParams) => Number(value))
  @Validate(BBlogIdValidator)
  blogId: number;
}
