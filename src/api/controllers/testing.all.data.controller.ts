import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const tables = [
  'BannedUsersForBlog',
  'LikeForComment',
  'LikeForPost',
  'Comments',
  'Posts',
  'Blogs',
  'PasswordRecovery',
  'RefreshTokenMetas',
  'Users',
];
@SkipThrottle()
@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  @HttpCode(204)
  @Delete()
  async DeleteAll() {
    for (const table of tables) {
      await this.dataSource.query(`DELETE FROM "${table}"`);
    }
    const collections = this.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    return;
  }
}
