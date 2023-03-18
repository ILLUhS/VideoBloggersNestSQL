import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: any; deviceId: string; login: string }; //todo userId number
}

export default RequestWithUser;
