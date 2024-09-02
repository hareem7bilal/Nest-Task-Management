import { Injectable } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { CreateStudentDto } from './student.dto';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';
import { In } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const { firstName, lastName } = createStudentDto;

    const student = this.studentRepository.create({
      id: uuid(),
      firstName,
      lastName,
    });

    return this.studentRepository.save(student);
  }

  async getStudent(id: string): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }

  async getStudents(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    const uniqueStudentIds = Array.from(new Set(studentIds));

    const students = await Promise.all(
      uniqueStudentIds.map(async (id) => {
        return await this.studentRepository.findOne({
          where: {
            id,
          },
        });
      }),
    );

    return students.filter((student) => student !== null);
  }
}
