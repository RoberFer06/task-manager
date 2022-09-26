import { TaskStatus } from '../task-status.enuml';

export class TaskFilterDto {
  status?: TaskStatus;
  search?: string;
}
