import { Injectable } from '@nestjs/common';
import { RefreshTokenMetasRepository } from '../../ifrastructure/repositories/refresh.token.metas.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private refreshTokenMetasRepository: RefreshTokenMetasRepository,
  ) {}

  async deleteSession(userId: number, deviceId: string) {
    return await this.refreshTokenMetasRepository.deleteByUserIdAndDeviceId(
      userId,
      deviceId,
    );
  }
}
