import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateDtoType } from '../../modules/public/application/types/user.create.dto.type';
import { Injectable } from '@nestjs/common';
import { FoundUserDtoType } from '../../modules/auth/types/found-user-dto.type';

export type UserDocument = HydratedDocument<User>;

export type UserModelMethods = {
  confirmEmail(): Promise<boolean>;
  updEmailCode(): Promise<void>;
  setPassHash(newPassHash: string): Promise<void>;
  getEmailIsConfirmed(): Promise<boolean>;
  ban(reason: string): Promise<void>;
  unban(): Promise<void>;
};
export type UserModelStaticMethods = {
  makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument>;
};
export type UserModelType = Model<UserDocument> &
  UserModelMethods &
  UserModelStaticMethods;

@Injectable()
@Schema()
export class User {
  constructor(private userDto: UserCreateDtoType) {
    this.login = userDto.login;
    this.passwordHash = userDto.passwordHash;
    this.email = userDto.email;
    this.createdAt = new Date().toISOString();
    this.emailConfirmationCode = uuidv4();
    this.emailExpirationTime = add(new Date(), { hours: 24 });
    this.emailIsConfirmed = false;
    this.isBanned = false;
  }

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  emailConfirmationCode: string;

  @Prop({ required: true })
  emailExpirationTime: Date;

  @Prop({ required: true })
  emailIsConfirmed: boolean;

  @Prop({ required: true, default: false })
  isBanned: boolean;

  @Prop({ default: null })
  banDate: string;

  @Prop({ default: null })
  banReason: string;

  async confirmEmail(): Promise<boolean> {
    if (
      this.emailExpirationTime <= new Date() ||
      this.emailIsConfirmed === true
    )
      return false;
    this.emailIsConfirmed = true;
    return true;
  }
  async updEmailCode(): Promise<void> {
    this.emailConfirmationCode = uuidv4();
    this.emailExpirationTime = add(new Date(), { hours: 24 });
  }
  async setPassHash(newPassHash: string): Promise<void> {
    this.passwordHash = newPassHash;
  }
  async getEmailIsConfirmed(): Promise<boolean> {
    return this.emailIsConfirmed;
  }
  async ban(reason: string): Promise<void> {
    this.isBanned = true;
    this.banDate = new Date().toISOString();
    this.banReason = reason;
  }
  async unban(): Promise<void> {
    this.isBanned = false;
    this.banDate = null;
    this.banReason = null;
  }
  async setAll(userDto: FoundUserDtoType) {
    this.id = userDto.id;
    this.login = userDto.login;
    this.passwordHash = userDto.passwordHash;
    this.email = userDto.email;
    this.createdAt = userDto.createdAt;
    this.emailConfirmationCode = userDto.emailConfirmationCode;
    this.emailExpirationTime = userDto.emailExpirationTime;
    this.emailIsConfirmed = userDto.emailIsConfirmed;
    this.isBanned = userDto.isBanned;
    this.banDate = userDto.banDate;
    this.banReason = userDto.banDate;
  }
  static async makeInstance(
    userDto: UserCreateDtoType,
    UserModel: UserModelType,
  ): Promise<UserDocument> {
    return new UserModel({
      id: uuidv4(),
      login: userDto.login,
      passwordHash: userDto.passwordHash,
      email: userDto.email,
      createdAt: new Date().toISOString(),
      emailConfirmationCode: uuidv4(),
      emailExpirationTime: add(new Date(), { hours: 24 }),
      emailIsConfirmed: false,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.statics = {
  makeInstance: User.makeInstance,
};
UserSchema.methods = {
  confirmEmail: User.prototype.confirmEmail,
  updEmailCode: User.prototype.updEmailCode,
  setPassHash: User.prototype.setPassHash,
  getEmailIsConfirmed: User.prototype.getEmailIsConfirmed,
  ban: User.prototype.ban,
  unban: User.prototype.unban,
};
