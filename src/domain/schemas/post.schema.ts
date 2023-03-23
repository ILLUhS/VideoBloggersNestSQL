import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, Model } from 'mongoose';
import { PostCreateDto } from '../../modules/public/application/types/post.create.dto';
import { PostUpdateDto } from '../../modules/public/application/types/post.update.dto';
import { Reaction, ReactionDocument } from './reaction.schema';
import { FoundPostDtoType } from '../../modules/public/types/found-post-dto.type';

export type PostDocument = HydratedDocument<Post>;

export type PostModelMethods = {
  updateProperties(postDto: PostUpdateDto): void;
  updateBlogName(blogName: string): void;
  setBanStatus(isBanned: boolean): void;
};
export type PostModelStaticMethods = {
  makeInstance(
    postDto: PostCreateDto,
    blogName: string,
    userId: string,
    PostModel: PostModelType,
  ): PostDocument;
};
export type PostModelType = Model<PostDocument> &
  PostModelMethods &
  PostModelStaticMethods;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  constructor(private postDto: PostCreateDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.createdAt = new Date().toISOString();
  }
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: number;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  isBanned: boolean;

  reactions: ReactionDocument[];

  static makeInstance(
    postDto: PostCreateDto,
    blogName: string,
    userId: string,
    PostModel: PostModelType,
  ): PostDocument {
    return new PostModel({
      id: uuidv4(),
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: postDto.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
      userId: userId,
      isBanned: false,
    });
  }
  updateProperties(postDto: PostUpdateDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
  }
  updateBlogName(blogName: string) {
    this.blogName = blogName;
  }
  setBanStatus(isBanned: boolean) {
    this.isBanned = isBanned;
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

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.statics = { makeInstance: Post.makeInstance };
PostSchema.methods = {
  updateProperties: Post.prototype.updateProperties,
  updateBlogName: Post.prototype.updateBlogName,
  setBanStatus: Post.prototype.setBanStatus,
};
PostSchema.virtual('reactions', {
  ref: Reaction.name,
  localField: 'id',
  foreignField: 'entityId',
  options: { lean: true },
});
