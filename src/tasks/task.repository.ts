import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskFilterDto } from './dto/task-filter-dto';
import { TaskStatus } from './task-status.enuml';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findFilter(filter: TaskFilterDto): Promise<Task[]> {
    const { status, search } = filter;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) like LOWER(:search) OR LOWER(task.description) like LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async createTask(createTask: CreateTaskDto): Promise<Task> {
    const { title, description } = createTask;

    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.PENDING,
    });

    return this.save(task);
  }
}
