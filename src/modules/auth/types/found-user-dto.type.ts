export type FoundUserDtoType = {
  id: number;
  login: string;
  passwordHash: string;
  email: string;

  createdAt: string;

  emailConfirmationCode: string;

  emailExpirationTime: Date;

  emailIsConfirmed: boolean;

  isBanned: boolean;

  banDate: string | null;

  banReason: string | null;
};
