import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPassCommand } from './commands/new-pass.command';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { PasswordRecoveriesRepository } from '../../../ifrastructure/repositories/password-recoveries.repository';
import { AuthService } from '../../services/auth.service';

@CommandHandler(NewPassCommand)
export class NewPassUseCase implements ICommandHandler<NewPassCommand> {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
    private passRecRepository: PasswordRecoveriesRepository,
  ) {}

  async execute(command: NewPassCommand): Promise<boolean> {
    const { recoveryCode, newPassword } = command.newPassDto;
    const passRec = await this.passRecRepository.findByField(
      'recoveryCode',
      recoveryCode,
    );
    if (!passRec) return false;
    const result = await passRec.recoveryConfirm();
    if (!result) return false;
    await this.passRecRepository.update(passRec);
    const user = await this.usersRepository.findByField1('id', passRec.userId);
    if (!user) return false;
    const newPassHash = await this.authService.getPassHash(newPassword);
    await user.setPassHash(newPassHash);
    return await this.usersRepository.update(user);
  }
}
