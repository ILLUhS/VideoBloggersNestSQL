import { ReactionForPostCreateDtoType } from '../../modules/public/application/types/reaction-for-post-create-dto.type';

const reactions = ['None', 'Like', 'Dislike'];
export class LikeForPost {
  constructor(likeDto: ReactionForPostCreateDtoType) {
    this.postId = likeDto.postId;
    this.userId = likeDto.userId;
    this.reaction = likeDto.reaction;
    this.createdAt = new Date();
  }
  postId: number;
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
