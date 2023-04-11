import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateDtoType } from '../../modules/public/application/types/user.create.dto.type';
import { Injectable } from '@nestjs/common';
import { FoundUserDtoType } from '../../modules/auth/types/found-user-dto.type';

@Injectable()
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
  id: number;
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmationCode: string;
  emailExpirationTime: Date;
  emailIsConfirmed: boolean;
  isBanned: boolean;
  banDate: string;
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
}
