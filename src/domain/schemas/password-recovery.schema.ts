import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PassRecCreateDtoType } from '../../modules/public/application/types/passRecCreateDtoType';
import { FoundPassRecDtoType } from '../../modules/auth/types/found-pass-rec-dto.type';

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

export type PasswordRecoveryModelMethods = {
  recoveryConfirm(): Promise<boolean>;
  updRecovery(email: string): Promise<void>;
};
export type PasswordRecoveryModelStaticMethods = {
  makeInstance(
    PasswordRecoveryDto: PassRecCreateDtoType,
    PasswordRecoveryModel: PasswordRecoveryModelType,
  ): Promise<PasswordRecoveryDocument>;
};
export type PasswordRecoveryModelType = Model<PasswordRecoveryDocument> &
  PasswordRecoveryModelMethods &
  PasswordRecoveryModelStaticMethods;

@Schema()
export class PasswordRecovery {
  constructor(private passRecDto: PassRecCreateDtoType) {
    this.userId = passRecDto.userId;
    this.email = passRecDto.email;
    this.recoveryCode = uuidv4();
    this.expirationTime = add(new Date(), { hours: 24 });
    this.isUsed = false;
    this.createdAt = new Date().toISOString();
  }
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  expirationTime: Date;

  @Prop({ required: true })
  isUsed: boolean;

  @Prop({ required: true })
  createdAt: string;

  async recoveryConfirm(): Promise<boolean> {
    if (this.expirationTime <= new Date() || this.isUsed === true) return false;
    this.isUsed = true;
    return true;
  }
  async updRecovery(email: string): Promise<void> {
    this.email = email;
    this.recoveryCode = uuidv4();
    this.expirationTime = add(new Date(), { hours: 24 });
    this.isUsed = false;
  }

  static async makeInstance(
    PasswordRecoveryDto: PassRecCreateDtoType,
    PasswordRecoveryModel: PasswordRecoveryModelType,
  ): Promise<PasswordRecoveryDocument> {
    return new PasswordRecoveryModel({
      userId: PasswordRecoveryDto.userId,
      email: PasswordRecoveryDto.email,
      recoveryCode: uuidv4(),
      expirationTime: add(new Date(), { hours: 24 }),
      isUsed: false,
      createdAt: new Date().toISOString(),
    });
  }

  async setAll(passRecDto: FoundPassRecDtoType) {
    this.userId = passRecDto.userId;
    this.email = passRecDto.email;
    this.recoveryCode = passRecDto.recoveryCode;
    this.expirationTime = passRecDto.expirationTime;
    this.isUsed = passRecDto.isUsed;
    this.createdAt = passRecDto.createdAt;
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
PasswordRecoverySchema.statics = {
  makeInstance: PasswordRecovery.makeInstance,
};
PasswordRecoverySchema.methods = {
  recoveryConfirm: PasswordRecovery.prototype.recoveryConfirm,
  updRecovery: PasswordRecovery.prototype.updRecovery,
};
