import { BlogUpdateDto } from '../../../../../public/application/types/blog.update.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly id: number,
    public readonly blogDto: BlogUpdateDto,
  ) {}
}
