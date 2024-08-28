import { DataSource, Repository } from "typeorm";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetTasksFilterDto } from "./dtos/get-tasks-filter.dto";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {

    private logger = new Logger('TasksRepository', { timestamp: true })

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')

        query.where({ user })

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        try {
            const tasks = await query.getMany()
            return tasks
        } catch (err) {
            this.logger.error(`Failed to fetch tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, err.stack)
            throw new InternalServerErrorException()
        }

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })
        await this.save(task)
        return task
    }

    async deleteTask(id: string, user: User): Promise<number> {
        const result = await this.delete({ id, user })
        return result.affected;
    }

}