import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { CreateBlogUseCase } from './application/use-cases/blogs/create-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/blogs/delete-blog.use-case';
import { UpdateBlogUseCase } from './application/use-cases/blogs/update-blog.use-case';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/posts/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/posts/delete-post.use-case';
import { BBlogsService } from './application/services/b-blogs.service';
import { BlogsPostsController } from './api/controllers/blogs-posts.controller';
import { PublicModule } from '../public/public.module';
import { PostIdValidator } from './api/controllers/validators/post-id.validator';
import { BUsersController } from './api/controllers/b-users.controller';
import { BanUserForBlogUseCase } from './application/use-cases/users/ban-user-for-blog.use-case';
import { BBlogIdValidator } from './api/controllers/validators/b-blog.id.validator';
import { BCommentsQueryRepository } from './infrastructure/query.repositories/b-comments-query.repository';
import { BBannedUserForBlogQueryRepository } from './infrastructure/query.repositories/b-banned-user-for-blog-query.repository';
import { BPostsService } from './application/services/b-posts.service';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  BanUserForBlogUseCase,
];
const services = [BBlogsService, BPostsService];
const repositories = [];
const queryRepositories = [
  BCommentsQueryRepository,
  BBannedUserForBlogQueryRepository,
];
const validators = [BBlogIdValidator, PostIdValidator];

@Module({
  imports: [AuthModule, PublicModule, CqrsModule, ConfigModule],
  controllers: [BlogsPostsController, BUsersController],
  providers: [
    ...useCases,
    ...services,
    ...repositories,
    ...queryRepositories,
    ...validators,
  ],
})
export class BloggerModule {}
