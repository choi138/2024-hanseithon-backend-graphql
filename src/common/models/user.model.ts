import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { UserRole } from '@prisma/client';

import { StudentModel } from './student.model';
import { TeamMemberModel } from './team-member.model';

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType({ description: '사용자' })
export class UserModel {
  @Field(() => String, { description: '사용자 아이디' })
  id: string;
  @Field(() => String, { description: '사용자 이메일' })
  email: string;
  @Field(() => String, { description: '사용자 이름' })
  name: string;
  @Field(() => UserRole, { description: '사용자 역할' })
  role: UserRole;
  @Field(() => String, {
    description: '사용자 프로필 이미지 URL',
    nullable: true,
  })
  profileUrl?: string;
  @Field(() => Date, { description: '사용자 생성일' })
  createdAt: Date;
  @Field(() => Date, { description: '사용자 업데이트일' })
  updatedAt: Date;
  @Field(() => Date, {
    description: '사용자 마지막 로그인 시각',
    nullable: true,
  })
  lastLoginAt?: Date;
  @Field(() => String, {
    description: '사용자 마지막 로그인 IP',
    nullable: true,
  })
  lastLoginIp?: string;

  @Field(() => StudentModel, { description: '학생 정보' })
  student: StudentModel;

  @Field(() => TeamMemberModel, { description: '팀 멤버 정보', nullable: true })
  teamMember?: TeamMemberModel;

  //   files;
}
