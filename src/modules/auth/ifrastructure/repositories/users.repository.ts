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
  async findByField1(field: string, value: any): Promise<User | null> {
    const foundUser = await this.dataSource.query(
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
    const user = new User({
      login: foundUser[0].login,
      passwordHash: foundUser[0].passwordHash,
      email: foundUser[0].email,
    });
    await user.setAll(foundUser[0]);
    return user;
  }
  async update(user: User): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."Users"
                SET 
                "login"=$2, 
                "passwordHash"=$3, 
                "email"=$4, 
                "createdAt"=$5, 
                "emailConfirmationCode"=$6, 
                "emailExpirationTime"=$7, 
                "emailIsConfirmed"=$8, 
                "isBanned"=$9, 
                "banDate"=$10, 
                "banReason"=$11
              WHERE "id" = $1;`,
      [
        user.id,
        user.login,
        user.passwordHash,
        user.email,
        user.createdAt,
        user.emailConfirmationCode,
        user.emailExpirationTime,
        user.emailIsConfirmed,
        user.isBanned,
        user.banDate,
        user.banReason,
      ],
    );
    return !!result;
  }

  //mongo
  /*constructor(@InjectModel(User.name) protected userModel: UserModelType) {}*/

  /*async create(userDto: UserCreateDtoType): Promise<UserDocument> {
    return await this.userModel.makeInstance(userDto, this.userModel);
  }*/
  async findById(id: any): Promise<UserDocument | null> {
    return this.userModel.findOne({ id: id });
  }
  async findByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ [field]: value });
  }
  async save(user: UserDocument): Promise<boolean> {
    return !!(await user.save());
  }
}
