export class BanUnbanBlogCommand {
  constructor(
    public readonly blogId: number,
    public readonly isBanned: boolean,
  ) {}
}
