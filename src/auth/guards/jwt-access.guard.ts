import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException('사용자 정보를 불러오는데 실패했어요');
    }
    const ctx = GqlExecutionContext.create(context);
    ctx.getContext().user = user; // Ensure user is set in context
    return user;
  }
}
