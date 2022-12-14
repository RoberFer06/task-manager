import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/domain/model/user.entity';
import { CreateTaskDto } from '../dto/create-task-dto';
import { TaskFilterDto } from '../dto/task-filter-dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status-dto';
import { Task } from '../domain/model/task.entity';
import { TasksService } from '../service/tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll(
    @Query() search: TaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.findAll(search, user);
  }

  @Post()
  createTask(
    @Body() task: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(task, user);
  }

  @Get('/:id')
  findOne(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.findOne(id, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, user, updateStatus);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.deleteTask(id, user);
  }
}
