import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './commands/delete-user.command';
import { UsersRepository } from '../../../../auth/ifrastructure/repositories/users.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}
  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { id } = command;
    return await this.usersRepository.deleteById(id);
  }
}
