import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationCommand } from './commands/registration.command';
import { AuthService } from '../../services/auth.service';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { User } from '../../../../../domain/entities/user.entity';

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: RegistrationCommand): Promise<void> {
    const { login, email, password } = command.userDto;
    const passwordHash = await this.authService.getPassHash(password);
    const user = new User({
      login,
      email,
      passwordHash,
    });
    await this.authService.sendConfirmEmail(user);
    this.usersRepository.create(user);
    return;
  }
}
