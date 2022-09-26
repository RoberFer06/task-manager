import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';

@Injectable()
export class TasksService {
  private task: Task[] = [
    {
      id: '58c172c5-a263-4764-997c-9687f09060d4',
      title: 'first task',
      description: 'this has to be don at 9:00 pm',
      status: TaskStatus.PENDING,
    },
    {
      id: '58c172c5-a263-4764-997c-9687f09060d5',
      title: 'second task',
      description: 'this has to be don at 9:00 pm',
      status: TaskStatus.PENDING,
    },
    {
      id: '58c172c5-a263-4764-997c-9687f09060d6',
      title: 'threeth task',
      description: 'this has to be don at 9:00 pm',
      status: TaskStatus.PENDING,
    },
  ];

  findAll(): Task[] {
    return this.task;
  }

  createTask(createTask: CreateTaskDto) {
    const { title, description } = createTask;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.PENDING,
    };
    this.task.push(task);
  }

  findOne(id: string): Task {
    const taskFound = this.task.find((task) => task.id === id);
    if (!taskFound) {
      throw new NotFoundException();
    }
    return taskFound;
  }

  deleteTask(id: string) {
    const index = this.task.findIndex((task) => task.id === id);
    this.task.splice(index, 1);
  }

  updateTaskStatus(id: string, taskRequest: UpdateTaskStatusDto): Task {
    const taskIndex = this.task.findIndex((item) => item.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException(`task with id ${id} is not found`);
    }
    this.task[taskIndex].status = taskRequest.status;
    return this.task[taskIndex];
  }
}
