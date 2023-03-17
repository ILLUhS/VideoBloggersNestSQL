import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../auth/ifrastructure/repositories/users.repository';

@Injectable()
export class BUsersRepository extends UsersRepository {}
