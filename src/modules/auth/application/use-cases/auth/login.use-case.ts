import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { RefreshTokenMetasRepository } from '../../../ifrastructure/repositories/refresh.token.metas.repository';
import { AuthService } from '../../services/auth.service';
import { TokensType } from '../../types/tokens.type';

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private refreshTokenMetaRepository: RefreshTokenMetasRepository,
  ) {}

  async execute(command: LoginCommand): Promise<TokensType> {
    const { userId, login, deviceName, ip } = command;
    const accessToken = await this.authService.createAccessToken(userId, login);
    const refreshToken = await this.authService.createRefreshToken(
      userId,
      login,
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    await this.refreshTokenMetaRepository.create({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceId: getPayload.deviceId,
      deviceIp: ip,
      deviceName: deviceName,
      userId: getPayload.userId,
    });
    return { accessToken, refreshToken };
  }
}
