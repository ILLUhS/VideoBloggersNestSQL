import { BlogInputDto } from '../../../../../public/application/types/blog-input.dto';

export class CreateBlogCommand {
  constructor(
    public readonly blogDto: BlogInputDto,
    public readonly userId: number,
  ) {}
}
