import { Test } from '@nestjs/testing';
import { TaskStatus } from '../domain/task-status.enuml';
import { TaskRepository } from '../domain/repository/task.repository';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  findFilter: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser = {
  username: 'MockName',
  id: 'mockId',
  password: 'comepasword',
  task: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository: {
    findFilter: { mockResolvedValue: (arg0: any) => void };
    findOneBy: { mockResolvedValue: (arg0: any) => void };
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get(TasksService);
    taskRepository = await module.get(TaskRepository);
  });

  describe('getTask', () => {
    it('call TaskRepository.getTask and return the result', async () => {
      taskRepository.findFilter.mockResolvedValue('something');
      const result = await taskService.findAll(null, mockUser);
      expect(result).toEqual('something');
    });

    describe('getTaskById', () => {
      it('calls TaskReposito.findOne and return the result', async () => {
        const mockTask = {
          title: 'test task',
          description: 'test description',
          id: 'someId',
          status: TaskStatus.OPEN,
        };

        taskRepository.findOneBy.mockResolvedValue(mockTask);
        const result = await taskService.findOne(mockTask.id, mockUser);
        expect(result).toEqual(mockTask);
      });

      it('calls TaskReposito.findOne and handles an error', async () => {
        taskRepository.findOneBy.mockResolvedValue(null);
        expect(taskService.findOne('some', mockUser)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
