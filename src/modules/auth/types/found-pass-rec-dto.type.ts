export type FoundPassRecDtoType = {
  userId: number;

  email: string;

  recoveryCode: string;

  expirationTime: Date;

  isUsed: boolean;

  createdAt: string;
};
