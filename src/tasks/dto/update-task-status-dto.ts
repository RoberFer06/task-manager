import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
