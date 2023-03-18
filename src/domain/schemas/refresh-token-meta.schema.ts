import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RefreshTokenMetaCreateDtoType } from '../../modules/auth/types/refresh-token-meta-create-dto.type';
import { RefreshTokenMetaUpdateDto } from '../../modules/auth/types/refresh.token.meta.update.dto';

export type RefreshTokenMetaDocument = HydratedDocument<RefreshTokenMeta>;

export type RefreshTokenMetaModelMethods = {
  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto): void;
};
export type RefreshTokenMetaModelStaticMethods = {
  makeInstance(
    refreshTokenMetaModelDto: RefreshTokenMetaCreateDtoType,
    RefreshTokenMetaModel: RefreshTokenMetaModelType,
  ): RefreshTokenMetaDocument;
};
export type RefreshTokenMetaModelType = Model<RefreshTokenMetaDocument> &
  RefreshTokenMetaModelMethods &
  RefreshTokenMetaModelStaticMethods;

@Schema()
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

  @Prop({ required: true })
  issuedAt: number;

  @Prop({ required: true })
  expirationAt: number;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceIp: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  userId: number;

  static makeInstance(
    refreshTokenMetaCreateDto: RefreshTokenMetaCreateDtoType,
    RefreshTokenMetaModel: RefreshTokenMetaModelType,
  ): RefreshTokenMetaDocument {
    return new RefreshTokenMetaModel(refreshTokenMetaCreateDto);
  }

  updateProperties(refreshTokenMetaUpdateDto: RefreshTokenMetaUpdateDto) {
    this.issuedAt = refreshTokenMetaUpdateDto.issuedAt;
    this.expirationAt = refreshTokenMetaUpdateDto.expirationAt;
    this.deviceIp = refreshTokenMetaUpdateDto.deviceIp;
  }
}

export const RefreshTokenMetaSchema =
  SchemaFactory.createForClass(RefreshTokenMeta);
RefreshTokenMetaSchema.statics = {
  makeInstance: RefreshTokenMeta.makeInstance,
};
RefreshTokenMetaSchema.methods = {
  updateProperties: RefreshTokenMeta.prototype.updateProperties,
};
