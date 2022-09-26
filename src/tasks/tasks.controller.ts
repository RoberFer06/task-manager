import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskFilterDto } from './dto/task-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import {} from './task-status.enuml';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll(@Query() search: TaskFilterDto): Promise<Task[]> {
    return this.taskService.findAll(search);
  }

  @Post()
  createTask(@Body() task: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(task);
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Post('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, updateStatus);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
