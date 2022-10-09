import { TaskStatus } from '../domain/task-status.enuml';

export class TaskFilterDto {
  status?: TaskStatus;
  search?: string;
}
