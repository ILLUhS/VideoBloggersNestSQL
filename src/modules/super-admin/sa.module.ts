import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SaBlogsController } from './api/controllers/sa-blogs.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { SaUsersService } from './application/services/sa-users.service';
import { UserIdValidator } from './api/validators/user-id.validator';
import { BindBlogWithUserUseCase } from './application/use-cases/blogs/bind-blog-with-user.use-case';
import { SaBlogsQueryRepository } from './infrastructure/query.repositories/sa-blogs-query.repository';
import { SaUsersController } from './api/controllers/sa-users.controller';
import { SaUsersQueryRepository } from './infrastructure/query.repositories/sa-users-query.repository';
import { CreateUserUseCase } from './application/use-cases/users/create-user.use-case';
import { BanUnbanUserUseCase } from './application/use-cases/users/ban-unban-user.use-case';
import { BlogIdValidator } from './api/validators/blog.id.validator';
import { SaBlogsService } from './application/services/sa-blogs.service';
import { AuthModule } from '../auth/auth.module';
import { PublicModule } from '../public/public.module';
import { DeleteUserUseCase } from './application/use-cases/users/delete-user.use-case';
import { BanUnbanBlogUseCase } from './application/use-cases/blogs/ban-unban-blog.use-case';

const useCases = [
  BindBlogWithUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  BanUnbanUserUseCase,
  BanUnbanBlogUseCase,
];
const services = [SaUsersService, SaBlogsService];
const repositories = [];
const queryRepositories = [SaBlogsQueryRepository, SaUsersQueryRepository];
const validators = [UserIdValidator, BlogIdValidator];

@Module({
  imports: [AuthModule, PublicModule, CqrsModule, ConfigModule],
  controllers: [SaBlogsController, SaUsersController],
  providers: [
    ...validators,
    ...services,
    ...useCases,
    ...repositories,
    ...queryRepositories,
  ],
})
export class SaModule {}
