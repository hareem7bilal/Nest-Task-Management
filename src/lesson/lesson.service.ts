import { Injectable } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { v4 as uuid } from 'uuid';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './lesson.dto';

@Injectable()
export class LessonService {
  constructor(private lessonRepository: LessonRepository) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonDto;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students
    });
    return this.lessonRepository.save(lesson);
  }

  async getLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.findOne({ where: { id } });
  }

  async getLessons(): Promise<Lesson[]>{
    return this.lessonRepository.find();
  }

  async assignStudentsToLesson(lessonId: string, studentIds: string[]):Promise<Lesson>{
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
    lesson.students = [...lesson.students, ...studentIds];
    return this.lessonRepository.save(lesson);
  }
}
