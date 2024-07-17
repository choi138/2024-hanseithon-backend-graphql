import { InputType, registerEnumType } from '@nestjs/graphql';
import { OmitType } from '@nestjs/swagger';

import { StudentDepartment } from '@prisma/client';

import { StudentModel } from 'src/common/models';

registerEnumType(StudentDepartment, { name: 'StudentDepartment' });

@InputType({ description: '학생 신청 DTO' })
export class CreateStudentDto extends OmitType(StudentModel, ['id', 'userId']) {}
