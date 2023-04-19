import { PasswordRecovery } from '../../../../domain/entities/password-recovery.schema';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PasswordRecoveriesRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource /*@InjectModel(PasswordRecovery.name)
    private passRecModel: PasswordRecoveryModelType,*/,
  ) {}

  async create(passRec: PasswordRecovery): Promise<number> {
    const result = await this.dataSource.query(
      `INSERT INTO public."PasswordRecovery"(
                "userId",
                "email", 
                "recoveryCode", 
                "expirationTime", 
                "isUsed", 
                "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING "userId";`,
      [
        passRec.userId,
        passRec.email,
        passRec.recoveryCode,
        passRec.expirationTime,
        passRec.isUsed,
        passRec.createdAt,
      ],
    );
    return result[0].userId;
  }
  async findByField(
    field: string,
    value: any,
  ): Promise<PasswordRecovery | null> {
    const foundRec = await this.dataSource.query(
      `SELECT
                "userId",
                "email", 
                "recoveryCode", 
                "expirationTime", 
                "isUsed", 
                "createdAt"
                FROM public."PasswordRecovery"
                WHERE "${field}" = $1;`,
      [value],
    );
    if (!foundRec.length) return null;
    const passRec = new PasswordRecovery({
      userId: foundRec[0].userId,
      email: foundRec[0].email,
    });
    await passRec.setAll(foundRec[0]);
    return passRec;
  }
  async update(passRec: PasswordRecovery): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."PasswordRecovery"
                SET 
                "email"=$2, 
                "recoveryCode"=$3, 
                "expirationTime"=$4, 
                "isUsed"=$5, 
                "createdAt"=$6
              WHERE "userId" = $1;`,
      [
        passRec.userId,
        passRec.email,
        passRec.recoveryCode,
        passRec.expirationTime,
        passRec.isUsed,
        passRec.createdAt,
      ],
    );
    return !!result;
  }
  //mongo
  /*async create(
    PasswordRecoveryDto: PassRecCreateDtoType,
  ): Promise<PasswordRecoveryDocument> {
    return await this.passRecModel.makeInstance(
      PasswordRecoveryDto,
      this.passRecModel,
    );
  }
  async findByUserId(userId: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ userId: userId });
  }
  async findByCode(code: string): Promise<PasswordRecoveryDocument | null> {
    return this.passRecModel.findOne({ recoveryCode: code });
  }
  async save(passRec: PasswordRecoveryDocument): Promise<boolean> {
    return !!(await passRec.save());
  }
  async deleteAll(): Promise<boolean> {
    return (await this.passRecModel.deleteMany().exec()).acknowledged;
  }*/
}
