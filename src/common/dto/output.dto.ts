import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '결과 공통 DTO' })
export class AuthCommonDto<T = unknown> {
  @Field(() => String, { description: '결과 상태' })
  readonly status: 'SUCCESS' | 'FAIL';

  @Field(() => null, { description: '결과', nullable: true })
  readonly result?: T;
}
