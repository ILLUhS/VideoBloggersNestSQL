import { ReactionForPostCreateDtoType } from '../../../types/reaction-for-post-create-dto.type';

export class CreateLikeDislikeForPostCommand {
  constructor(public readonly reactionDto: ReactionForPostCreateDtoType) {}
}
