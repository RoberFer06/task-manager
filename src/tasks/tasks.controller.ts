import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskFilterDto } from './dto/task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import {} from './task-status.enuml';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

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

  @Post('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, user, updateStatus);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
