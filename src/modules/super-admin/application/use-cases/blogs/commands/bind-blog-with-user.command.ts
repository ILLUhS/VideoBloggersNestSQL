export class BindBlogWithUserCommand {
  constructor(public readonly blogId: number, public readonly userId: number) {}
}
