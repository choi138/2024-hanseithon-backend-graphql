import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    public readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.token]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const { isExist, user } = await this.usersService.findById(payload.sub);
    if (!isExist) throw new Error('사용자 정보를 불러오는데 실패했어요');

    return user;
  }
}
