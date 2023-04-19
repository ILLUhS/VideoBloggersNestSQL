import { ReactionForCommentCreateDtoType } from '../../modules/public/application/types/reaction-for-comment-create-dto.type';

const reactions = ['None', 'Like', 'Dislike'];
export class LikeForComment {
  constructor(likeDto: ReactionForCommentCreateDtoType) {
    this.commentId = likeDto.commentId;
    this.userId = likeDto.userId;
    this.reaction = likeDto.reaction;
    this.createdAt = new Date();
  }
  commentId: number;
  userId: number;
  reaction: string;
  createdAt: Date;
  async setCreatedAt(createdAt: Date): Promise<void> {
    this.createdAt = createdAt;
  }
  async setReaction(reaction: string): Promise<boolean> {
    if (!reactions.includes(reaction)) return false;
    this.reaction = reaction;
    return true;
  }
}
