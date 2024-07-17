import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/common/prisma';

import { LogService } from './log.service';

@Module({
  imports: [PrismaModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
