import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../auth/domain/model/user.entity';
import { CreateTaskDto } from '../dto/create-task-dto';
import { TaskFilterDto } from '../dto/task-filter-dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status-dto';
import { Task } from '../domain/model/task.entity';
import { TaskRepository } from '../domain/repository/task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async findAll(filter: TaskFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.findFilter(filter, user);
  }

  createTask(createTask: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTask, user);
  }

  async findOne(id: string, user: User): Promise<Task> {
    const taskFound = await this.taskRepository.findOneBy({ id, user });
    if (!taskFound) {
      throw new NotFoundException();
    }
    return taskFound;
  }

  async deleteTask(id: string, user: User) {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskStatus(
    id: string,
    user: User,
    taskRequest: UpdateTaskStatusDto,
  ): Promise<Task> {
    const currentTask = await this.findOne(id, user);
    currentTask.status = taskRequest.status;
    return await this.taskRepository.save(currentTask);
  }
}
