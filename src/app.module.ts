import { Module } from '@nestjs/common';
import { AppController } from './api/controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingAllDataController } from './api/controllers/testing.all.data.controller';
import { AuthModule } from './modules/auth/auth.module';
import { SaModule } from './modules/super-admin/sa.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BloggerModule } from './modules/blogger/blogger.module';
import { PublicModule } from './modules/public/public.module';
import { AppService } from './application/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';

@Module({
  imports: [
    AuthModule,
    SaModule,
    BloggerModule,
    PublicModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ThrottlerModule.forRootAsync({ useFactory: () => ({ ttl: 10, limit: 5 }) }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST, //'localhost',
      //port: 5432,
      username: process.env.PGUSER, //'postgres',
      password: process.env.PGPASSWORD, //'admin',
      database: process.env.PGDATABASE, //'video-bloggers',
      entities: [],
      autoLoadEntities: false,
      synchronize: false,
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
