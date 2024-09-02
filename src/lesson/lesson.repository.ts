import { DataSource, Repository } from "typeorm";
import { Lesson } from "./lesson.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LessonRepository extends Repository<Lesson> {
    constructor(private dataSource: DataSource) {
        super(Lesson, dataSource.createEntityManager());
    }
}