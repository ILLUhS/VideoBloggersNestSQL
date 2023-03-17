import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationCommand } from './commands/registration.command';
import { AuthService } from '../../services/auth.service';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { User } from '../../../../../domain/schemas/user.schema';

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
    /*const user = await this.usersRepository.create({
      login: login,
      passwordHash: passwordHash,
      email: email,
    });*/
    //await this.authService.sendConfirmEmail(user);
    await this.usersRepository.create(user);
    //await this.usersRepository.save(user);
    return;
  }
}
