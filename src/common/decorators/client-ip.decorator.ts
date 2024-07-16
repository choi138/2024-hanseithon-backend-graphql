import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import * as requestIp from 'request-ip';

export const ClientIp = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  if (request.clientIp) return request.clientIp;
  return requestIp.getClientIp(request);
});
