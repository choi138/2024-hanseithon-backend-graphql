import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: '로그인 성공 시 반환되는 Payload' })
export class AuthOutputDto {
  @Field({ description: 'JWT 인증 토큰' })
  accessToken: string;
}
