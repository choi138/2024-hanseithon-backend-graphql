import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: process.env.NODE_ENV === 'development',
    }),
  );

  app.use(requestIp.mw());
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
