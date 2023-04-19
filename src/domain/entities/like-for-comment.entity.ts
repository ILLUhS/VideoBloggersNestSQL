import { ReactionForCommentCreateDtoType } from '../../modules/public/application/types/reaction-for-comment-create-dto.type';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';

export enum Reaction {
  NONE = 'None',
  LIKE = 'Like',
  DISLIKE = 'Dislike',
}
@Entity()
export class LikeForComment {
  constructor(private likeDto: ReactionForCommentCreateDtoType) {
    this.commentId = likeDto.commentId;
    this.userId = likeDto.userId;
    this.reaction = likeDto.reaction;
    this.createdAt = new Date();
  }

  @PrimaryColumn()
  commentId: number;

  @PrimaryColumn()
  userId: number;

  @Column({
    type: 'enum',
    enum: Reaction,
    default: Reaction.NONE,
  })
  reaction: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;
  async setCreatedAt(createdAt: Date): Promise<void> {
    this.createdAt = createdAt;
  }
  async setReaction(reaction: string): Promise<boolean> {
    if (!Object.keys(Reaction).includes(reaction)) return false;
    this.reaction = reaction;
    return true;
  }
}
