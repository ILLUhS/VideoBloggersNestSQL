import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: number; deviceId: string; login: string };
}

export default RequestWithUser;
