import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAuthUserById(id: number) {
    const user = await this.dataSource.query(
      `SELECT
                "id",
                "login",
                "email",
                FROM public."Users"
                WHERE "id" = $1;`,
      [id],
    );
    if (!user.length) return null;
    return {
      email: user[0].email,
      login: user[0].login,
      userId: user[0].id,
    };
  }
}
