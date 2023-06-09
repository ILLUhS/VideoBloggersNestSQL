import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PassRecoveryCommand } from './commands/pass-recovery.command';
import { UsersRepository } from '../../../ifrastructure/repositories/users.repository';
import { PasswordRecoveriesRepository } from '../../../ifrastructure/repositories/password-recoveries.repository';
import { AuthService } from '../../services/auth.service';
import { PasswordRecovery } from '../../../../../domain/entities/password-recovery.entity';

@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
    private passRecRepository: PasswordRecoveriesRepository,
  ) {}

  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.usersRepository.findOneByField('email', email);
    if (!user) return false;
    let passRec = await this.passRecRepository.findByField('userId', user.id);
    if (!passRec) {
      passRec = new PasswordRecovery({
        userId: user.id,
        email: email,
      });
      await this.passRecRepository.create(passRec);
    } else {
      await passRec.updRecovery(user.email);
      await this.passRecRepository.update(passRec);
    }
    await this.authService.sendRecoveryEmail(passRec);
    return true;
  }
}
