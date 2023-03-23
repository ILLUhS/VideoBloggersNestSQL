import { BanUserForBlogInputDto } from '../../../../api/input.dto/ban-user-for-blog-input.dto';

export class BanUserForBlogCommand {
  constructor(
    public readonly userId: number,
    public readonly bloggerId: number,
    public readonly banDto: BanUserForBlogInputDto,
  ) {}
}
