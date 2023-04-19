import { Module } from '@nestjs/common';
import { AppController } from './api/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { TestingAllDataController } from './api/controllers/testing.all.data.controller';
import { AuthModule } from './modules/auth/auth.module';
import { SaModule } from './modules/super-admin/sa.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BloggerModule } from './modules/blogger/blogger.module';
import { PublicModule } from './modules/public/public.module';
import { AppService } from './application/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForComment } from './domain/entities/like-for-comment.entity';
import { User } from './domain/entities/user.entity';
import { RefreshTokenMeta } from './domain/entities/refresh-token-meta.entity';
import { PasswordRecovery } from './domain/entities/password-recovery.entity';
import { Blog } from './domain/entities/blog.entity';
import { LikeForPost } from './domain/entities/like-for-post.entity';
import { Post } from './domain/entities/post.entity';
import { BannedUserForBlog } from './domain/entities/banned-user-for-blog.entity';
import { Comment } from './domain/entities/comment.entity';

@Module({
  imports: [
    AuthModule,
    SaModule,
    BloggerModule,
    PublicModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRootAsync({ useFactory: () => ({ ttl: 10, limit: 5 }) }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      /*host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'video-bloggers',*/
      host: process.env.PGHOST,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      /*host: process.env.PGHOST_THIN,
      username: process.env.PGUSER_THIN,
      password: process.env.PGPASSWORD_THIN,
      database: process.env.PGDATABASE_THIN,*/
      entitySkipConstructor: true,
      entities: [
        User,
        RefreshTokenMeta,
        PasswordRecovery,
        Blog,
        Post,
        LikeForPost,
        Comment,
        LikeForComment,
        BannedUserForBlog,
      ],
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    }),
  ],
  controllers: [AppController, TestingAllDataController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
