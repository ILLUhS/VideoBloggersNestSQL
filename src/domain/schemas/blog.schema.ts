import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BlogInputDto } from '../../modules/public/application/types/blog-input.dto';
import { BlogUpdateDto } from '../../modules/public/application/types/blog.update.dto';
import { UserInfoType } from '../../modules/blogger/types/user-info.type';
import { BannedUsersType } from '../types/banned-users.type';
import { BannedUserDtoType } from '../types/banned-user-dto.type';
import { BlogCreateDtoType } from '../../modules/blogger/types/blog-create-dto.type';
import { FoundBlogDtoType } from '../../modules/public/types/found-blog-dto.type';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelMethods = {
  updateProperties(blogDto: BlogUpdateDto): void;
  setOwner(userId: string, userLogin: string): void;
  banUser(bannedUser: BannedUserDtoType): void;
  unbanUser(bannedUser: BannedUserDtoType): void;
  ban(): void;
  unban(): void;
};
export type BlogModelStaticMethods = {
  makeInstance(
    blogDto: BlogInputDto,
    userInfo: UserInfoType,
    BlogModel: BlogModelType,
  ): BlogDocument;
};
export type BlogModelType = Model<BlogDocument> &
  BlogModelMethods &
  BlogModelStaticMethods;

@Schema()
export class Blog {
  constructor(private blogDto: BlogCreateDtoType) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
    this.userId = blogDto.userId;
    this.isBanned = false;
  }
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ default: null })
  banDate: string;

  @Prop({ required: true, default: [] })
  bannedUsers: BannedUsersType[];

  static makeInstance(
    blogDto: BlogInputDto,
    userInfo: UserInfoType,
    BlogModel: BlogModelType,
  ): BlogDocument {
    return new BlogModel({
      id: uuidv4(),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
      userId: userInfo.userId,
      userLogin: userInfo.login,
      isBanned: false,
    });
  }

  updateProperties(blogDto: BlogUpdateDto) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
  }

  setOwner(userId: number, userLogin: string) {
    this.userId = userId;
    this.userLogin = userLogin;
  }

  banUser(bannedUser: BannedUserDtoType) {
    this.bannedUsers.push({
      id: bannedUser.id,
      login: bannedUser.login,
      isBanned: true,
      banDate: new Date().toISOString(),
      banReason: bannedUser.banReason,
    });
  }

  unbanUser(bannedUser: BannedUserDtoType) {
    const userIndex = this.bannedUsers.findIndex((e) => e.id === bannedUser.id);
    if (userIndex !== -1) {
      this.bannedUsers[userIndex].isBanned = false;
      this.bannedUsers[userIndex].banReason = null;
      this.bannedUsers[userIndex].banDate = null;
    }
  }

  ban() {
    this.isBanned = true;
    this.banDate = new Date().toISOString();
  }

  unban() {
    this.isBanned = false;
    this.banDate = null;
  }

  async setAll(blogDto: FoundBlogDtoType) {
    this.id = blogDto.id;
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
    this.createdAt = blogDto.createdAt;
    this.isMembership = blogDto.isMembership;
    this.userId = blogDto.userId;
    this.isBanned = blogDto.isBanned;
    this.banDate = blogDto.banDate;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.statics = { makeInstance: Blog.makeInstance };
BlogSchema.methods = {
  updateProperties: Blog.prototype.updateProperties,
  setOwner: Blog.prototype.setOwner,
  banUser: Blog.prototype.banUser,
  unbanUser: Blog.prototype.unbanUser,
  ban: Blog.prototype.ban,
  unban: Blog.prototype.unban,
};
