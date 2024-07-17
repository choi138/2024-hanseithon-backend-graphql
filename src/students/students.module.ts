import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/common/prisma';

import { StudentsService } from './students.service';

@Module({
  imports: [PrismaModule],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
