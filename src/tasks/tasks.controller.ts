import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.taskService.findAll();
  }

  @Post()
  createTask(@Body() task: CreateTaskDto) {
    this.taskService.createTask(task);
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Task {
    return this.taskService.findOne(id);
  }

  @Post('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateTaskStatusDto,
  ): Task {
    console.log(id);
    return this.taskService.updateTaskStatus(id, updateStatus);
  }
}
