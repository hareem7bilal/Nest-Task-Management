import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class AssignStudentsToLessonDto {
  @IsUUID()
  @Field((type) => ID)
  lessonId: string;

  @IsUUID("4", {each: true})
  @Field((type) => [ID])
  studentIds: string[];
}
