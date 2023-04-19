import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { PassRecCreateDtoType } from '../../modules/public/application/types/passRecCreateDtoType';
import { FoundPassRecDtoType } from '../../modules/auth/types/found-pass-rec-dto.type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PasswordRecovery {
  constructor(private passRecDto: PassRecCreateDtoType) {
    this.userId = passRecDto.userId;
    this.email = passRecDto.email;
    this.recoveryCode = uuidv4();
    this.expirationTime = add(new Date(), { hours: 24 });
    this.isUsed = false;
    this.createdAt = new Date().toISOString();
  }

  @PrimaryColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  recoveryCode: string;

  @Column()
  expirationTime: Date;

  @Column()
  isUsed: boolean;

  @Column()
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
  async setAll(passRecDto: FoundPassRecDtoType) {
    this.userId = passRecDto.userId;
    this.email = passRecDto.email;
    this.recoveryCode = passRecDto.recoveryCode;
    this.expirationTime = passRecDto.expirationTime;
    this.isUsed = passRecDto.isUsed;
    this.createdAt = passRecDto.createdAt;
  }
}
