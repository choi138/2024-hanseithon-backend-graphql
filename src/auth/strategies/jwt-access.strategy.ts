import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    public readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string }) {
    const { isExist, user } = await this.usersService.findById(payload.sub);
    if (!isExist) throw new UnauthorizedException('사용자를 불러오는데 실패했어요.');

    return user;
  }
}
