import { Injectable } from '@nestjs/common';

import { UserModel } from './dto/user.dto';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 모든 사용자 조회
  async findManyUserAll(): Promise<UserModel[]> {
    return this.prisma.user.findMany();
  }
}
