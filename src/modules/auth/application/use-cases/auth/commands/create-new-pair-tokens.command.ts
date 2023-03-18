export class CreateNewPairTokensCommand {
  constructor(
    public readonly userId: number,
    public readonly login: string,
    public readonly deviceId: string,
    public readonly ip: string,
  ) {}
}
