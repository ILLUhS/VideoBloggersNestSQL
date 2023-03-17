import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../../domain/schemas/user.schema';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(User.name) protected userModel: UserModelType,
  ) {}
  async create(user: User) {
    return this.dataSource.query(
      `INSERT INTO public."Users"(
                "login", 
                "passwordHash", 
                "email", 
                "createdAt", 
                "emailConfirmationCode", 
                "emailExpirationTime", 
                "emailIsConfirmed", 
                "isBanned")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id";`,
      [
        user.login,
        user.passwordHash,
        user.email,
        user.createdAt,
        user.emailConfirmationCode,
        user.emailExpirationTime,
        user.emailIsConfirmed,
        user.isBanned,
      ],
    );
  }
  async findByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    const user = await this.dataSource.query(
      `SELECT
                "id",
                "login", 
                "passwordHash", 
                "email", 
                "createdAt", 
                "emailConfirmationCode", 
                "emailExpirationTime", 
                "emailIsConfirmed",
                "isBanned",
                "banDate",
                "banReason"
                FROM public."Users"
                WHERE "${field}" = $1;`,
      [value],
    );
    console.log(user[0]);
    return this.userModel.findOne({ [field]: value });
  }

  //mongo
  /*constructor(@InjectModel(User.name) protected userModel: UserModelType) {}*/

  /*async create(userDto: UserCreateDtoType): Promise<UserDocument> {
    return await this.userModel.makeInstance(userDto, this.userModel);
  }*/
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ id: id });
  }
  /*async findByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ [field]: value });
  }*/
  async save(user: UserDocument): Promise<boolean> {
    return !!(await user.save());
  }
}
