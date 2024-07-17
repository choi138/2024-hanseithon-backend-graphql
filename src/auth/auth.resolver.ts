import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { ClientIp } from 'src/common/decorators';
import { UserModel } from 'src/common/models';

import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { AuthOutputDto } from './dto/auth-output.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAccessGuard, JwtRefreshGuard } from './guards';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => UserModel)
  async signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<UserModel> {
    return await this.authService.signUp(signUpDto);
  }

  @Mutation(() => AuthOutputDto)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('signInDto') signInDto: SignInDto,
    @Context('req') req: Request,
    @GetUser() user: UserModel,
    @ClientIp() clientIp: string,
  ): Promise<AuthOutputDto> {
    await this.authService.signIn(signInDto);
    const { accessToken, refreshToken, refreshCookieOption } =
      this.authService.issueLoginTokenSet(user);
    await this.authService.updateLastLoginIp(user.id, clientIp);

    req.res.cookie('token', refreshToken, refreshCookieOption);
    return { accessToken };
  }

  @Mutation(() => AuthOutputDto)
  @UseGuards(JwtRefreshGuard)
  async silent(
    @GetUser() user: UserModel,
    @ClientIp() clientIp: string,
    @Context('req') req: Request,
  ): Promise<AuthOutputDto> {
    const { accessToken, refreshToken, refreshCookieOption } =
      this.authService.issueLoginTokenSet(user);
    await this.authService.updateLastLoginIp(user.id, clientIp);
    req.res.cookie('token', refreshToken, refreshCookieOption);

    return { accessToken };
  }

  @Query(() => UserModel)
  @UseGuards(JwtAccessGuard)
  async me(@GetUser() user: UserModel): Promise<UserModel> {
    return user;
  }
}
