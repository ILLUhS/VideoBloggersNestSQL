import { ReactionForPostCreateDtoType } from '../../modules/public/application/types/reaction-for-post-create-dto.type';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Reaction } from './like-for-comment.schema';
import { Post } from './post.entity';

@Entity()
export class LikeForPost {
  constructor(likeDto: ReactionForPostCreateDtoType) {
    this.postId = likeDto.postId;
    this.userId = likeDto.userId;
    this.reaction = likeDto.reaction;
    this.createdAt = new Date();
  }

  @PrimaryColumn()
  postId: number;

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

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
  async setCreatedAt(createdAt: Date): Promise<void> {
    this.createdAt = createdAt;
  }
  async setReaction(reaction: string): Promise<boolean> {
    if (!Object.keys(Reaction).includes(reaction)) return false;
    this.reaction = reaction;
    return true;
  }
}
