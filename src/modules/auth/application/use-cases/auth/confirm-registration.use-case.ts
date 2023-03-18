import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmRegistrationCommand } from './commands/confirm-registration.command';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmRegistrationCommand): Promise<boolean> {
    const { code } = command;
    const user = await this.usersRepository.findByField1(
      'emailConfirmationCode',
      code,
    );
    if (!user) return false;
    const result = await user.confirmEmail();
    if (!result) return false;
    const result1 = await this.usersRepository.update(user);
    console.log(result1);
    return result1;
  }
}
