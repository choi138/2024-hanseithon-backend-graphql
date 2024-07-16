import { Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './dto/user.dto';

import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel], { description: '사용자 목록' })
  async findManyUserAll(): Promise<UserModel[]> {
    return this.usersService.findManyUserAll();
  }
}
