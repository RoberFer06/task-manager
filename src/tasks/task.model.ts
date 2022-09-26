export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  DONE = 'done',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
}
