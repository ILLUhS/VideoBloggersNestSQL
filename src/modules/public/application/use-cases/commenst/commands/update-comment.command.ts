import { CommentUpdateDto } from '../../../types/comment.update.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: number,
    public readonly commentDto: CommentUpdateDto,
  ) {}
}
