import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateBookDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => Number)
  price: number;
}
