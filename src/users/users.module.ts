import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/common/prisma';

@Module({
  providers: [UsersService, UsersResolver, PrismaService],
})
export class UsersModule {}
