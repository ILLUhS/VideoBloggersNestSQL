import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { BanUserForBlogInputDto } from '../input.dto/ban-user-for-blog-input.dto';
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { BanUserForBlogCommand } from '../../application/use-cases/users/commands/ban-user-for-blog.command';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { QueryTransformPipe } from '../../../public/api/pipes/query-transform.pipe';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { CheckOwnerBlogInterceptor } from './interceptors/check-owner-blog.interceptor';
import { IntTransformPipe } from '../../../public/api/pipes/int-transform.pipe';
import { BBannedUserForBlogQueryRepository } from '../../infrastructure/query.repositories/b-banned-user-for-blog-query.repository';

@SkipThrottle()
@Controller('blogger/users')
export class BUsersController {
  constructor(
    private commandBus: CommandBus,
    private bannedUserForBlogQueryRepository: BBannedUserForBlogQueryRepository,
  ) {}

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @Get('blog/:id')
  async findBannedUsersByBlog(
    @Param('id', new IntTransformPipe()) blogId: number,
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
  ) {
    return await this.bannedUserForBlogQueryRepository.getBanUsersByBlogId(
      query,
      blogId,
    );
  }

  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Put(':id/ban')
  async banUnbanUser(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() banDto: BanUserForBlogInputDto,
    @Req() req: RequestWithUser,
  ) {
    await this.commandBus.execute(
      new BanUserForBlogCommand(id, req.user.userId, banDto),
    );
    return;
  }
}
