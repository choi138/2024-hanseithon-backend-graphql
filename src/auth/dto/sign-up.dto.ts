import { StudentDepartment } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { NAME_REGEX } from 'src/common/constant';

import { AuthCommonDto } from './auth-common.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: '학생 정보' })
class SignUpStudentDTO {
  @Field(() => String, { description: '학과' })
  @IsNotEmpty({ message: '학과 입력은 필수에요.' })
  @IsEnum(StudentDepartment, { message: '올바른 학과를 입력해주세요.' })
  readonly department: StudentDepartment;

  @Field(() => Number, { description: '학년' })
  @IsNotEmpty({ message: '학년 입력은 필수에요.' })
  @IsNumber({}, { message: '올바른 학년을 입력해주세요.' })
  @Min(1, { message: '올바른 학년을 입력해주세요.' })
  @Max(3, { message: '올바른 학년을 입력해주세요.' })
  readonly grade: number;

  @Field(() => Number, { description: '반' })
  @IsNotEmpty({ message: '반 입력은 필수에요.' })
  @IsNumber({}, { message: '올바른 반을 입력해주세요.' })
  @Min(1, { message: '올바른 반을 입력해주세요.' })
  @Max(3, { message: '올바른 반을 입력해주세요.' })
  readonly classroom: number;

  @Field(() => Number, { description: '번호' })
  @IsNotEmpty({ message: '번호 입력은 필수에요.' })
  @IsNumber({}, { message: '올바른 번호를 입력해주세요.' })
  @Min(1, { message: '최소 1, 최대 25까지 입력할 수 있어요' })
  @Max(25, { message: '최소 1, 최대 25까지 입력할 수 있어요' })
  readonly number: number;
}

@InputType({ description: '회원가입 정보' })
export class SignUpDto extends AuthCommonDto {
  @Field(() => String, { description: '사용자 이름' })
  @IsNotEmpty({ message: '이름 입력은 필수에요.' })
  @IsString({ message: '올바른 이름을 입력해주세요.' })
  @Matches(NAME_REGEX, {
    message: '이름은 한글로 최소 2자, 최대 4자까지 입력할 수 있어요',
  })
  readonly name: string;

  @Field(() => SignUpStudentDTO, { description: '학생 정보' })
  @IsNotEmpty({ message: '올바른 학번 정보를 입력해주세요.' })
  @ValidateNested() //  중첩된 객체에 대한 유효성 검사
  @Type(() => SignUpStudentDTO) // 중첩 타입을 지정
  readonly student: SignUpStudentDTO;
}
