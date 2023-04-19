import { Injectable } from '@nestjs/common';
import { RefreshTokenMeta } from '../../../../domain/entities/refresh-token-meta.entity';
import { RefreshTokenMetaCreateDtoType } from '../../types/refresh-token-meta-create-dto.type';
import { DataSource } from 'typeorm';

@Injectable()
export class RefreshTokenMetasRepository {
  constructor(protected dataSource: DataSource) {}

  async create(
    refreshTokenMetaDto: RefreshTokenMetaCreateDtoType,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."RefreshTokenMetas"(
                "issuedAt",
                "expirationAt", 
                "deviceId", 
                "deviceIp", 
                "deviceName", 
                "userId")
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id";`,
      [
        refreshTokenMetaDto.issuedAt,
        refreshTokenMetaDto.expirationAt,
        refreshTokenMetaDto.deviceId,
        refreshTokenMetaDto.deviceIp,
        refreshTokenMetaDto.deviceName,
        refreshTokenMetaDto.userId,
      ],
    );
    return result[0].id;
  }
  async find(
    issuedAt: number,
    deviceId: string,
    userId: number,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `SELECT
                "id",
                "issuedAt",
                "expirationAt", 
                "deviceId", 
                "deviceIp", 
                "deviceName", 
                "userId"
                FROM public."RefreshTokenMetas"
                WHERE "issuedAt" = $1
                AND "deviceId" = $2
                AND "userId" = $3;`,
      [issuedAt, deviceId, userId],
    );
    if (!result.length) return false;
    return true; //!! - конвертирует переменную в логическое значение
  }
  async findByUserIdAndDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<RefreshTokenMeta | null> {
    const foundSession = await this.dataSource.query(
      `SELECT
                "id",
                "issuedAt",
                "expirationAt", 
                "deviceId", 
                "deviceIp", 
                "deviceName", 
                "userId"
                FROM public."RefreshTokenMetas"
                WHERE "userId" = $1
                AND "deviceId" = $2;`,
      [userId, deviceId],
    );
    if (!foundSession.length) return null;
    const session = new RefreshTokenMeta({
      issuedAt: foundSession[0].issuedAt,
      expirationAt: foundSession[0].expirationAt,
      deviceId: foundSession[0].deviceId,
      deviceIp: foundSession[0].deviceIp,
      deviceName: foundSession[0].deviceName,
      userId: foundSession[0].userId,
    });
    session.id = foundSession[0].id;
    return session;
  }
  async findByDeviceId(deviceId: string): Promise<RefreshTokenMeta | null> {
    const foundSession = await this.dataSource.query(
      `SELECT
                "id",
                "issuedAt",
                "expirationAt", 
                "deviceId", 
                "deviceIp", 
                "deviceName", 
                "userId"
                FROM public."RefreshTokenMetas"
                WHERE "deviceId" = $1;`,
      [deviceId],
    );
    if (!foundSession.length) return null;
    const session = new RefreshTokenMeta({
      issuedAt: foundSession[0].issuedAt,
      expirationAt: foundSession[0].expirationAt,
      deviceId: foundSession[0].deviceId,
      deviceIp: foundSession[0].deviceIp,
      deviceName: foundSession[0].deviceName,
      userId: foundSession[0].userId,
    });
    session.id = foundSession[0].id;
    return session;
  }
  async update(session: RefreshTokenMeta): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."RefreshTokenMetas"
                SET 
                "issuedAt"=$2, 
                "expirationAt"=$3, 
                "deviceId"=$4, 
                "deviceIp"=$5, 
                "deviceName"=$6, 
                "userId"=$7
              WHERE "id" = $1;`,
      [
        session.id,
        session.issuedAt,
        session.expirationAt,
        session.deviceId,
        session.deviceIp,
        session.deviceName,
        session.userId,
      ],
    );
    return !!result;
  }
  async deleteByUserIdAndDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."RefreshTokenMetas"
              WHERE "userId" = $1
              AND "deviceId" = $2
              RETURNING "id";`,
      [userId, deviceId],
    );
    if (!result.length) return false;
    return true;
  }
  async deleteAllExceptCurrent(
    userId: number,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."RefreshTokenMetas"
              WHERE "userId" = $1
              AND "deviceId" != $2
              RETURNING "id";`,
      [userId, deviceId],
    );
    if (!result.length) return false;
    return true;
  }
  async deleteByUserId(userId: number): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."RefreshTokenMetas"
              WHERE "userId" = $1
              RETURNING "id";`,
      [userId],
    );
    if (!result.length) return false;
    return true;
  }
}
