import { RefreshTokenMetaCreateDtoType } from '../../modules/auth/types/refresh-token-meta-create-dto.type';
import { RefreshTokenMetaUpdateDto } from '../../modules/auth/types/refresh.token.meta.update.dto';

export class RefreshTokenMeta {
  constructor(refreshTokenMetaDto: RefreshTokenMetaCreateDtoType) {
    this.issuedAt = refreshTokenMetaDto.issuedAt;
    this.expirationAt = refreshTokenMetaDto.expirationAt;
    this.deviceId = refreshTokenMetaDto.deviceId;
    this.deviceIp = refreshTokenMetaDto.deviceIp;
    this.deviceName = refreshTokenMetaDto.deviceName;
    this.userId = refreshTokenMetaDto.userId;
  }
  id: number;
  issuedAt: number;
  expirationAt: number;
  deviceId: string;
  deviceIp: string;
  deviceName: string;
  userId: number;

  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto) {
    this.issuedAt = refreshTokenMetaUpdateDto.issuedAt;
    this.expirationAt = refreshTokenMetaUpdateDto.expirationAt;
    this.deviceIp = refreshTokenMetaUpdateDto.deviceIp;
  }
}
