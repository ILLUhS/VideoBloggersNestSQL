import { BanUserForBlogDtoType } from '../../modules/blogger/types/ban-user-for-blog-dto.type';

export class BannedUserForBlog {
  constructor(blogId: number, userId: number) {
    this.blogId = blogId;
    this.userId = userId;
    this.isBanned = false;
  }
  id: number;
  blogId: number;
  userId: number;
  isBanned: boolean;
  banDate: string;
  banReason: string;
  banUser(banReason: string) {
    this.isBanned = true;
    this.banDate = new Date().toISOString();
    this.banReason = banReason;
  }
  unbanUser() {
    this.isBanned = false;
    this.banDate = null;
    this.banReason = null;
  }
  async setAll(userDto: BanUserForBlogDtoType) {
    this.id = userDto.id;
    this.blogId = userDto.blogId;
    this.userId = userDto.userId;
    this.isBanned = userDto.isBanned;
    this.banDate = userDto.banDate;
    this.banReason = userDto.banReason;
  }
}
