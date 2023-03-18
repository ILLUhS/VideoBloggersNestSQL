import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaDocument,
  RefreshTokenMetaModelType,
} from '../../../../domain/schemas/refresh-token-meta.schema';
import { RefreshTokenMetaCreateDtoType } from '../../types/refresh-token-meta-create-dto.type';
import { DataSource } from 'typeorm';

@Injectable()
export class RefreshTokenMetasRepository {
  constructor(
    protected dataSource: DataSource,
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
  ) {}

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
  /*async create(
    refreshTokenMetaDto: RefreshTokenMetaCreateDtoType,
  ): Promise<RefreshTokenMetaDocument> {
    return this.refreshTokenMetaModel.makeInstance(
      refreshTokenMetaDto,
      this.refreshTokenMetaModel,
    );
  }*/
  async find(
    issuedAt: number,
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.refreshTokenMetaModel
      .findOne({
        issuedAt: issuedAt,
        deviceId: deviceId,
        userId: userId,
      })
      .exec();
    return !!result; //!! - конвертирует переменную в логическое значение
  }
  async save(
    refreshTokenMetaModel: RefreshTokenMetaDocument,
  ): Promise<boolean> {
    return !!(await refreshTokenMetaModel.save());
  }
  async update(
    issuedAt: number,
    expirationAt: number,
    deviceId: string,
    deviceIp: string,
    userId: string,
  ): Promise<boolean> {
    return (
      (
        await this.refreshTokenMetaModel
          .updateOne(
            { deviceId: deviceId, userId: userId },
            {
              issuedAt: issuedAt,
              expirationAt: expirationAt,
              deviceIp: deviceIp,
            },
          )
          .exec()
      ).matchedCount === 1
    );
  }
  async deleteByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return (
      (
        await this.refreshTokenMetaModel
          .deleteOne({
            userId: userId,
            deviceId: deviceId,
          })
          .exec()
      ).deletedCount === 1
    );
  }
  async deleteById(userId: string): Promise<boolean> {
    return (
      await this.refreshTokenMetaModel.deleteMany({ userId: userId }).exec()
    ).acknowledged;
  }
  async deleteAll(): Promise<boolean> {
    return (await this.refreshTokenMetaModel.deleteMany().exec()).acknowledged;
  }
  async findByUserId(userId: string) {
    return await this.refreshTokenMetaModel
      .find({ userId: userId })
      .select({ _id: 0 })
      .exec();
  }
  async findByDeviceId(deviceId: string) {
    return await this.refreshTokenMetaModel
      .findOne({ deviceId: deviceId })
      .select({ _id: 0 })
      .exec();
  }
  async findByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<RefreshTokenMetaDocument | null> {
    return this.refreshTokenMetaModel.findOne({
      userId: userId,
      deviceId: deviceId,
    });
  }
  async deleteAllExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return (
      await this.refreshTokenMetaModel
        .deleteMany({ userId: userId })
        .where('deviceId')
        .ne(deviceId)
        .exec()
    ).acknowledged;
  }
  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    return (
      (
        await this.refreshTokenMetaModel
          .deleteOne({
            deviceId: deviceId,
          })
          .exec()
      ).deletedCount === 1
    );
  }
}
