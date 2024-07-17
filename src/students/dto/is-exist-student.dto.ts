import { ObjectType } from '@nestjs/graphql';

import { CreateStudentDto } from './create-student.dto';

@ObjectType({ description: '학생 정보' })
export class isExistStudentDto extends CreateStudentDto {}
