import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UsersModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
