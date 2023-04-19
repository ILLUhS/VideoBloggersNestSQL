import { CommentCreateDtoType } from '../../modules/public/application/types/comment.create.dto.type';
import { FoundCommentDtoType } from '../../modules/public/types/found-comment-dto.type';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { LikeForComment } from './like-for-comment.entity';

@Entity()
export class Comment {
  constructor(private commentDto: CommentCreateDtoType) {
    this.content = commentDto.content;
    this.postId = commentDto.postId;
    this.userId = commentDto.userId;
    this.createdAt = new Date().toISOString();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  userId: number;

  @Column()
  createdAt: string;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => LikeForComment, (like) => like.comment)
  likes: LikeForComment[];

  async setContent(content: string) {
    this.content = content;
  }
  async setAll(commentDto: FoundCommentDtoType) {
    this.id = commentDto.id;
    this.content = commentDto.content;
    this.postId = commentDto.postId;
    this.userId = commentDto.userId;
    this.createdAt = commentDto.createdAt;
  }
}
