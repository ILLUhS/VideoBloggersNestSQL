import { RefreshTokenMetaCreateDtoType } from '../../modules/auth/types/refresh-token-meta-create-dto.type';
import { RefreshTokenMetaUpdateDto } from '../../modules/auth/types/refresh.token.meta.update.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenMeta {
  constructor(refreshTokenMetaDto: RefreshTokenMetaCreateDtoType) {
    this.issuedAt = refreshTokenMetaDto.issuedAt;
    this.expirationAt = refreshTokenMetaDto.expirationAt;
    this.deviceId = refreshTokenMetaDto.deviceId;
    this.deviceIp = refreshTokenMetaDto.deviceIp;
    this.deviceName = refreshTokenMetaDto.deviceName;
    this.userId = refreshTokenMetaDto.userId;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issuedAt: number;

  @Column()
  expirationAt: number;

  @Column()
  deviceId: string;

  @Column()
  deviceIp: string;

  @Column()
  deviceName: string;

  @Column()
  userId: number;

  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto) {
    this.issuedAt = refreshTokenMetaUpdateDto.issuedAt;
    this.expirationAt = refreshTokenMetaUpdateDto.expirationAt;
    this.deviceIp = refreshTokenMetaUpdateDto.deviceIp;
  }
}
