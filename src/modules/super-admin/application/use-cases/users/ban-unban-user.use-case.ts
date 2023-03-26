import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BanUnbanUserCommand } from './commands/ban-unban-user.command';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../../../domain/schemas/user.schema';
import { SaUsersService } from '../../services/sa-users.service';
import { BadRequestException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersRepository } from '../../../../auth/ifrastructure/repositories/users.repository';
import { RefreshTokenMetasRepository } from '../../../../auth/ifrastructure/repositories/refresh.token.metas.repository';

@SkipThrottle()
@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserUseCase
  implements ICommandHandler<BanUnbanUserCommand>
{
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private usersService: SaUsersService,
    private usersRepository: UsersRepository,
    private refreshTokenMetaRepository: RefreshTokenMetasRepository,
  ) {}
  async execute(command: BanUnbanUserCommand) {
    const { id, isBanned, banReason } = command.banUserDto;
    const user = await this.usersService.findUserById(id);
    if (!user)
      throw new BadRequestException({
        message: [{ field: 'id', message: 'invalid id' }],
      });
    //delete all sessions by banned user
    if (isBanned) {
      await user.ban(banReason);
      await this.refreshTokenMetaRepository.deleteByUserId(id);
    } else await user.unban();
    await this.usersRepository.update(user);
    return;
  }
}
