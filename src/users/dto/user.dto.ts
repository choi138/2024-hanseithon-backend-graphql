import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '사용자' })
export class UserModel {
  @Field(() => String, { description: '사용자 아이디' })
  id: string;
  @Field(() => String, { description: '사용자 이름' })
  name: string;
  @Field(() => String, { description: '사용자 이메일' })
  email: string;
}
