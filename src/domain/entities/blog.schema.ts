import { BlogUpdateDto } from '../../modules/public/application/types/blog.update.dto';
import { BlogCreateDtoType } from '../../modules/blogger/types/blog-create-dto.type';
import { FoundBlogDtoType } from '../../modules/public/types/found-blog-dto.type';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { BannedUserForBlog } from './banned-user-for-blog.schema';

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

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: string;

  @Column()
  isMembership: boolean;

  @Column()
  userId: number;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: string;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @OneToMany(() => BannedUserForBlog, (bannedUser) => bannedUser.blog)
  bannedUsers: BannedUserForBlog[];

  updateProperties(blogDto: BlogUpdateDto) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
  }
  setOwner(userId: number) {
    this.userId = userId;
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
