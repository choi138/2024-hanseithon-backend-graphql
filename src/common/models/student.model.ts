import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { StudentDepartment } from '@prisma/client';

registerEnumType(StudentDepartment, { name: 'StudentDepartment' });

@ObjectType({ description: '학생' })
export class StudentModel {
  @Field(() => StudentDepartment, { description: '학과' })
  readonly department: StudentDepartment;

  @Field(() => Number, { description: '학년' })
  readonly grade: number;

  @Field(() => Number, { description: '반' })
  readonly classroom: number;

  @Field(() => Number, { description: '번호' })
  readonly number: number;
}
