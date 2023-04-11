import { CommentCreateDtoType } from '../../modules/public/application/types/comment.create.dto.type';
import { FoundCommentDtoType } from '../../modules/public/types/found-comment-dto.type';

export class Comment {
  constructor(commentDto: CommentCreateDtoType) {
    this.content = commentDto.content;
    this.postId = commentDto.postId;
    this.userId = commentDto.userId;
    this.createdAt = new Date().toISOString();
  }
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  postId: number;

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
