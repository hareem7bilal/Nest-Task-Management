import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model';
//import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {

    constructor(
        private tasksRepository: TasksRepository
    ) { }

    async getTaskById(id: string, user: User): Promise<Task> {

        const found = await this.tasksRepository.findOne({ where: { id, user } })
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user)
    }

    async deleteTask(id: string, user: User):Promise<void>{
        const result = await this.tasksRepository.deleteTask(id, user)
        console.log(result)
        if (result === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    getTasks(filterDto:GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user)
    }

    // private tasks: Task[] = [];

    // public getAllTasks(): Task[] {
    //     return this.tasks
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto

    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.DONE
    //     }
    //     this.tasks.push(task)
    //     return task
    // }

    // getTaskById(id: string): Task {
    //     // try to get task
    //     // if not found, throw 404 error
    //     // otherwise return the found task

    //     const found = this.tasks.find((task) => task.id === id)
    //     if(!found){
    //         throw new NotFoundException(`Task with id ${id} not found`);
    //     }
    //     return found 
    // }

    // deleteTask(id: string):void{
    //     const found = this.getTaskById(id)
    //     this.tasks=this.tasks.filter((task) => task.id !== found.id)
    // }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task>{
        const task = await this.getTaskById(id, user)
        task.status = status
        await this.tasksRepository.save(task)
        return task
    }

    // getTasksWithFilters(filterDto:GetTasksFilterDto):Task[] {
    //     const {status, search} = filterDto

    //     //define a temporary array to hold the result
    //     let tasks = this.getAllTasks()

    //     //do something with status
    //     if(status){
    //         tasks = tasks.filter((task)=>task.status===status)
    //     }
    //     //do something with search
    //     if(search){
    //         tasks = tasks.filter((task)=>{
    //             if(task.title.includes(search)||task.description.includes(search)){
    //                 return true
    //             }
    //             return false
    //         })
    //     }
    //     //return the final result
    //     return tasks

    // }


}
