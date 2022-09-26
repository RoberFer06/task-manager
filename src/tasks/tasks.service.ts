import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskFilterDto } from './dto/task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async findAll(filter: TaskFilterDto): Promise<Task[]> {
    return await this.taskRepository.findFilter(filter);
  }

  createTask(createTask: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTask);
  }

  async findOne(id: string): Promise<Task> {
    const taskFound = await this.taskRepository.findOneBy({ id });
    if (!taskFound) {
      throw new NotFoundException();
    }
    return taskFound;
  }

  async deleteTask(id: string) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskStatus(
    id: string,
    taskRequest: UpdateTaskStatusDto,
  ): Promise<Task> {
    const currentTask = await this.findOne(id);
    currentTask.status = taskRequest.status;
    return await this.taskRepository.save(currentTask);
  }
}
