import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LessonType } from './lesson.type';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './lesson.dto';
import { AssignStudentsToLessonDto } from './assign-students-to-lesson.dto';
import { Lesson } from './lesson.entity';
import { StudentService } from '../student/student.service';
@Resolver((of) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query((returns) => LessonType)
  lesson(@Args('id') id: string) {
    return this.lessonService.getLesson(id);
  }

  @Query((returns) => [LessonType])
  lessons() {
    return this.lessonService.getLessons();
  }

  @Mutation((returns) => LessonType)
  createLesson(@Args('createLessonDto') createLessonDto: CreateLessonDto) {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Mutation((returns) => LessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLessonDto')
    assignStudentsToLessonDto: AssignStudentsToLessonDto,
  ) {
    const { lessonId, studentIds } = assignStudentsToLessonDto;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    const students = await this.studentService.getManyStudents(lesson.students);
    console.log('Resolved Students:', students);
    return students;
  }
}
