import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import * as Strategies from './strategies';

@Module({
  imports: [UsersModule, ConfigModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AuthResolver, ...Object.values(Strategies)],
})
export class AuthModule {}
