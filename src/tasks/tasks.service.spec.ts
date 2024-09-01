import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
});

const mockUser = {
    username: "Ariel",
    id: "mockId",
    password: "pwd",
    tasks: []
}

const mockTask = {
    title: "mockTitle",
    id: "mockId",
    description: "mock description",
    status: TaskStatus.OPEN
}

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // initialize a NestJS module with a tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('Get Tasks', () => {
    it('Calls TasksRepository.getTasks and returns the result', async() => {
        expect(tasksRepository.getTasks).not.toHaveBeenCalled();
        tasksRepository.getTasks.mockResolvedValue("Some Value")
        const result = await tasksService.getTasks(null, mockUser)
        expect(tasksRepository.getTasks).toHaveBeenCalled()
        expect(result).toEqual("Some Value")

    });
  });

  describe('Get Tasks By ID', () => {
    it('Calls TasksRepository.findOne and returns the result', async() => {
        tasksRepository.findOne.mockResolvedValue(mockTask)
        const result = await tasksService.getTaskById("someId", mockUser)
        expect(result).toEqual(mockTask)
    });

    it('Calls TasksRepository.findOne and handles an error', async() => {
        tasksRepository.findOne.mockResolvedValue(null)
        expect(tasksService.getTaskById("someId", mockUser)).rejects.toThrow(NotFoundException)
    });
  });
});
