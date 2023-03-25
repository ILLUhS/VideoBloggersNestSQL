import { ReactionForCommentCreateDtoType } from '../../../types/reaction-for-comment-create-dto.type';

export class CreateLikeDislikeForCommentCommand {
  constructor(public readonly reactionDto: ReactionForCommentCreateDtoType) {}
}
