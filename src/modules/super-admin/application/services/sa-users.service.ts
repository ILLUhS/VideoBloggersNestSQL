import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../domain/schemas/user.schema';
import { UsersRepository } from '../../../auth/ifrastructure/repositories/users.repository';

@Injectable()
export class SaUsersService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    protected usersRepository: UsersRepository,
  ) {}
  async findUserById(userId: number): Promise<User | null> {
    return await this.usersRepository.findByField('id', userId);
  }
}
