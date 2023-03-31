import {
  Body,
  Controller,
  Delete,
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
import { BearerAuthGuard } from '../../../auth/api/controllers/guards/bearer-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryTransformPipe } from '../../../public/api/pipes/query-transform.pipe';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import RequestWithUser from '../../../../api/interfaces/request-with-user.interface';
import { BlogInputDto } from '../../../public/application/types/blog-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../../application/use-cases/blogs/commands/create-blog.command';
import { BlogUpdateDto } from '../../../public/application/types/blog.update.dto';
import { UpdateBlogCommand } from '../../application/use-cases/blogs/commands/update-blog.command';
import { CheckOwnerBlogInterceptor } from './interceptors/check-owner-blog.interceptor';
import { DeleteBlogCommand } from '../../application/use-cases/blogs/commands/delete-blog.command';
import { BlogPostInputDto } from '../../../public/types/blog.post.input.dto';
import { PostCreateDto } from '../../../public/application/types/post.create.dto';
import { CreatePostCommand } from '../../application/use-cases/posts/commands/create-post.command';
import { BlogIdPostIdInputDto } from '../input.dto/blog-id-post-id-input.dto';
import { UpdatePostCommand } from '../../application/use-cases/posts/commands/update-post.command';
import { PostUpdateDto } from '../../../public/application/types/post.update.dto';
import { DeletePostCommand } from '../../application/use-cases/posts/commands/delete-post.command';
import { BCommentsQueryRepository } from '../../infrastructure/query.repositories/b-comments-query.repository';
import { IntTransformPipe } from '../../../public/api/pipes/int-transform.pipe';
import { PostsQueryRepository } from '../../../public/infrastructure/query.repositories/posts-query.repository';
import { BlogsQueryRepository } from '../../../public/infrastructure/query.repositories/blogs-query.repository';

@SkipThrottle()
@Controller('blogger/blogs')
export class BlogsPostsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: BCommentsQueryRepository,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Get()
  async findBlogsByUser(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.blogsQueryRepository.getBlogsWithQueryParam(
      query,
      req.user.userId,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Get('comments')
  async findCommentsByBlog(
    @Query(new QueryTransformPipe()) query: QueryParamsDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.commentsQueryRepository.getCommentsByBlog(
      query,
      req.user.userId,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Post()
  async createBlog(@Body() blogDto: BlogInputDto, @Req() req: RequestWithUser) {
    const blogId = await this.commandBus.execute<
      CreateBlogCommand,
      Promise<number>
    >(new CreateBlogCommand(blogDto, req.user.userId));
    return await this.blogsQueryRepository.findBlogById(blogId);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId', new IntTransformPipe()) id: number,
    @Body() postDto: BlogPostInputDto,
  ) {
    const postCreateDto: PostCreateDto = {
      title: postDto.title,
      shortDescription: postDto.shortDescription,
      content: postDto.content,
      blogId: id,
    };
    const postId = await this.commandBus.execute<
      CreatePostCommand,
      Promise<number>
    >(new CreatePostCommand(postCreateDto));
    return await this.postsQueryRepository.findPostById(postId);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Put(':id')
  async updateBlogById(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() blogDto: BlogUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdateBlogCommand,
      Promise<boolean>
    >(new UpdateBlogCommand(id, blogDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePostByBlogId(
    @Param() BlogIdPostIdDto: BlogIdPostIdInputDto,
    @Body() postDto: PostUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdatePostCommand,
      Promise<boolean>
    >(new UpdatePostCommand(BlogIdPostIdDto, postDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id', new IntTransformPipe()) id: number) {
    const result = await this.commandBus.execute<
      DeleteBlogCommand,
      Promise<boolean>
    >(new DeleteBlogCommand(id));
    if (!result) throw new NotFoundException();
    return;
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerBlogInterceptor)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePostByBlogId(@Param() BlogIdPostIdDto: BlogIdPostIdInputDto) {
    const result = await this.commandBus.execute<
      DeletePostCommand,
      Promise<boolean>
    >(new DeletePostCommand(BlogIdPostIdDto));
    if (!result) throw new NotFoundException();
    return;
  }
}
