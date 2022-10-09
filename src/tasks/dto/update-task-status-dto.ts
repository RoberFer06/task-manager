import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../domain/task-status.enuml';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
