import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
//import { Task} from './task.model';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    // tasksService: TasksService;

    // constructor(tasksService: TasksService){
    //     this.tasksService = tasksService
    // }
    private logger = new Logger('TasksController')

    constructor(private tasksService: TasksService, private configService: ConfigService) {
        console.log(configService.get('TEST_VALUE'))
     }

    // @Get()
    // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    //     //if we have any filters defined, we call tasksService.getTasksWithFilters
    //     //otherwise. we call tasksService.getAllTasks
    //     if (Object.keys(filterDto).length) {
    //         return this.tasksService.getTasksWithFilters(filterDto)

    //     } else {
    //         return this.tasksService.getAllTasks()
    //     }

    // }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user)
    }

    // @Post()
    // createTask(@Body() createTaskDto: CreateTaskDto): Task {
    //     return this.tasksService.createTask(createTaskDto)
    // }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user)
    }

    // @Get('/:id')
    // getTaskById(@Param('id') id: string): Task {
    //     return this.tasksService.getTaskById(id)
    // }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    // @Delete('/:id')
    // deleteTask(@Param('id') id: string): void {
    //     return this.tasksService.deleteTask(id)
    // }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user)
    }

    // @Patch('/:id/status')
    // updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
    //     const {status} = updateTaskStatusDto
    //     return this.tasksService.updateTaskStatus(id, status)
    // }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @GetUser() user: User): Promise<Task> {
        const { status } = updateTaskStatusDto
        return this.tasksService.updateTaskStatus(id, status, user)
    }
}
