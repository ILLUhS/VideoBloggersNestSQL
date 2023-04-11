import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SaUsersService } from '../../application/services/sa-users.service';

@ValidatorConstraint({ name: 'userId', async: true })
@Injectable()
export class UserIdValidator implements ValidatorConstraintInterface {
  constructor(private usersService: SaUsersService) {}

  async validate(userId: number): Promise<boolean> {
    userId = Number(userId);
    if (isNaN(userId) || userId > 2147483647 || userId < -2147483648)
      throw new NotFoundException();
    const user = await this.usersService.findUserById(userId);
    return !!user;
  }
  defaultMessage() {
    return `userId incorrect`;
  }
}
