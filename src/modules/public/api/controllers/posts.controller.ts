import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { CommentInputDto } from '../../types/comment.input.dto';
import { LikeStatusInputDto } from '../../types/like.status.input.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../pipes/query-transform.pipe';
import { CommandBus } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/query.repositories/posts-query.repository';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { CommentsQueryRepository } from '../../infrastructure/query.repositories/comments-query.repository';
import { CreateCommentCommand } from '../../application/use-cases/commenst/commands/create-comment.command';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { IntTransformPipe } from '../pipes/int-transform.pipe';
import { CreateLikeDislikeForPostCommand } from '../../application/use-cases/reactions/commands/create-like-dislike-for-post.command';

@SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get()
  async findAll(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.postsQueryRepository.getPotsWithQueryParam(
      query,
      null,
      req.user.userId,
    );
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findById(
    @Param('id', new IntTransformPipe()) id: number,
    @Req() req: RequestWithUser,
  ) {
    const post = await this.postsQueryRepository.findPostById(
      id,
      req.user.userId,
    );
    if (!post) throw new NotFoundException();
    return post;
  }

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id/comments')
  async findCommentsByPostId(
    @Param('id', new IntTransformPipe()) id: number,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    const post = await this.postsQueryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return await this.commentsQueryRepository.getCommentsWithQueryParam(
      query,
      id,
      req.user.userId,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Post(':id/comments')
  async createCommentByPostId(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() commentDto: CommentInputDto,
    @Req() req: RequestWithUser,
  ) {
    const commentId = await this.commandBus.execute<
      CreateCommentCommand,
      Promise<number>
    >(
      new CreateCommentCommand({
        content: commentDto.content,
        userId: req.user.userId,
        postId: id,
      }),
    );
    if (!commentId) throw new InternalServerErrorException();
    return await this.commentsQueryRepository.findCommentById(commentId);
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeDislike(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() likeStatusInputDto: LikeStatusInputDto,
    @Req() req: RequestWithUser,
  ) {
    setTimeout(() => '', 1000);
    return await this.commandBus.execute(
      new CreateLikeDislikeForPostCommand({
        userId: req.user.userId,
        reaction: likeStatusInputDto.likeStatus,
        postId: id,
      }),
    );
  }
}
