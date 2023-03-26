import { HydratedDocument, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReactionDocument } from './reaction.schema';
import { CommentCreateDtoType } from '../../modules/public/application/types/comment.create.dto.type';
import { PostDocument } from './post.schema';
import { FoundCommentDtoType } from '../../modules/public/types/found-comment-dto.type';

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelMethods = {
  setContent(content: string): void;
  setBanStatus(isBanned: boolean): void;
};
export type CommentModelStaticMethods = {
  makeInstance(
    commentDto: CommentCreateDtoType,
    CommentModel: CommentModelType,
  ): CommentDocument;
};
export type CommentModelType = Model<CommentDocument> &
  CommentModelMethods &
  CommentModelStaticMethods;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Comment {
  constructor(commentDto: CommentCreateDtoType) {
    this.content = commentDto.content;
    this.postId = commentDto.postId;
    this.userId = commentDto.userId;
    this.createdAt = new Date().toISOString();
  }
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  postId: number;

  @Prop({ required: true })
  isBanned: boolean;

  reactions: ReactionDocument[];

  post: PostDocument;

  static makeInstance(
    commentDto: CommentCreateDtoType,
    CommentModel: CommentModelType,
  ): CommentDocument {
    return new CommentModel({
      id: uuidv4(),
      content: commentDto.content,
      userId: commentDto.userId,
      //userLogin: commentDto.userLogin,
      postId: commentDto.postId,
      createdAt: new Date().toISOString(),
      isBanned: false,
    });
  }

  async setContent(content: string) {
    this.content = content;
  }

  setBanStatus(isBanned: boolean) {
    this.isBanned = isBanned;
  }

  async setAll(commentDto: FoundCommentDtoType) {
    this.id = commentDto.id;
    this.content = commentDto.content;
    this.postId = commentDto.postId;
    this.userId = commentDto.userId;
    this.createdAt = commentDto.createdAt;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.statics = { makeInstance: Comment.makeInstance };
CommentSchema.methods = {
  setContent: Comment.prototype.setContent,
  setBanStatus: Comment.prototype.setBanStatus,
};
CommentSchema.virtual('reactions', {
  ref: 'Reaction',
  localField: 'id',
  foreignField: 'entityId',
  options: { lean: true },
});
CommentSchema.virtual('post', {
  ref: 'Post',
  localField: 'postId',
  foreignField: 'id',
  options: { lean: true },
  justOne: true,
});
