import { PostUpdateDto } from '../../modules/public/application/types/post.update.dto';
import { FoundPostDtoType } from '../../modules/public/types/found-post-dto.type';
import { PostCreateDtoType } from '../../modules/public/types/post-create-dto.type';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
import { LikeForPost } from './like-for-post.schema';

@Entity()
export class Post {
  constructor(private postDto: PostCreateDtoType) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.createdAt = new Date().toISOString();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  blogId: number;

  @Column()
  createdAt: string;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  blog: Blog;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => LikeForPost, (like) => like.post)
  likes: LikeForPost[];

  updateProperties(postDto: PostUpdateDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
  }
  async setAll(postDto: FoundPostDtoType) {
    this.id = postDto.id;
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.createdAt = postDto.createdAt;
  }
}
