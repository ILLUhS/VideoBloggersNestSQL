import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthHeaderInterceptor } from './interceptors/auth.header.interceptor';
import { CommentUpdateDto } from '../../application/types/comment.update.dto';
import { CheckOwnerCommentInterceptor } from './interceptors/check.owner.comment.interceptor';
import { LikeStatusInputDto } from '../../types/like.status.input.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { CommentsQueryRepository } from '../../infrastructure/query.repositories/comments-query.repository';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../../application/use-cases/commenst/commands/update-comment.command';
import { DeleteCommentCommand } from '../../application/use-cases/commenst/commands/delete-comment.command';
import { CreateLikeDislikeForCommentCommand } from '../../application/use-cases/reactions/commands/create-like-dislike-for-comment.command';
import { IntTransformPipe } from '../pipes/int-transform.pipe';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseInterceptors(AuthHeaderInterceptor)
  @Get(':id')
  async findCommentById(
    @Param('id', new IntTransformPipe()) id: number,
    @Req() req: RequestWithUser,
  ) {
    const comment = await this.commentsQueryRepository.findCommentById(
      id,
      req.user.userId,
    );
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Put(':id')
  async updComment(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() commentDto: CommentUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdateCommentCommand,
      Promise<boolean>
    >(new UpdateCommentCommand(id, commentDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @Put(':id/like-status')
  async setLikeDislike(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() likeStatusInputDto: LikeStatusInputDto,
    @Req() req: RequestWithUser,
  ) {
    await delay(1000);
    return await this.commandBus.execute(
      new CreateLikeDislikeForCommentCommand({
        userId: req.user.userId,
        reaction: likeStatusInputDto.likeStatus,
        commentId: id,
      }),
    );
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteComment(@Param('id', new IntTransformPipe()) id: number) {
    const result = this.commandBus.execute<
      DeleteCommentCommand,
      Promise<boolean>
    >(new DeleteCommentCommand(id));
    if (!result) throw new NotFoundException();
    return;
  }
}
