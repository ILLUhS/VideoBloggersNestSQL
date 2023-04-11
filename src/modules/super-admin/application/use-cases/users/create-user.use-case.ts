import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../../../domain/schemas/user.schema';
import { CreateUserCommand } from './commands/create-user.command';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../../../auth/ifrastructure/repositories/users.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(protected usersRepository: UsersRepository) {}
  async execute(command: CreateUserCommand): Promise<number> {
    const { login, email, password } = command.userDto;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(password, passwordSalt);
    const user = new User({
      login,
      email,
      passwordHash,
    });
    await user.confirmEmail();
    return await this.usersRepository.create(user);
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
