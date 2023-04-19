import { Injectable } from '@nestjs/common';
import { User } from '../../../../domain/entities/user.entity';
import { UsersRepository } from '../../../auth/ifrastructure/repositories/users.repository';

@Injectable()
export class SaUsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async findUserById(userId: number): Promise<User | null> {
    return await this.usersRepository.findOneByField('id', userId);
  }
}
