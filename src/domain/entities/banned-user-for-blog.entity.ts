import { BanUserForBlogDtoType } from '../../modules/blogger/types/ban-user-for-blog-dto.type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BannedUserForBlog {
  constructor(blogId: number, userId: number) {
    this.blogId = blogId;
    this.userId = userId;
    this.isBanned = false;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blogId: number;

  @Column()
  userId: number;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: string;

  @Column()
  banReason: string;

  @ManyToOne(() => Blog, (blog) => blog.bannedUsers)
  blog: Blog;

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
