import { Controller, Delete, HttpCode } from '@nestjs/common';
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
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  @HttpCode(204)
  @Delete()
  async DeleteAll() {
    for (const table of tables) {
      await this.dataSource.query(`DELETE FROM "${table}"`);
    }
    return;
  }
}
