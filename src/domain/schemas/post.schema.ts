import { PostUpdateDto } from '../../modules/public/application/types/post.update.dto';
import { FoundPostDtoType } from '../../modules/public/types/found-post-dto.type';
import { PostCreateDtoType } from '../../modules/public/types/post-create-dto.type';

export class Post {
  constructor(private postDto: PostCreateDtoType) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.createdAt = new Date().toISOString();
  }
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  createdAt: string;

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
