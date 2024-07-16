import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

// import { ClientIp } from 'src/common/decorators';

import { AuthCommonDto } from 'src/common/dto';
import { UserModel } from 'src/common/models';

import { AuthService } from './auth.service';
// import { GetUser, UserProfile } from './decorators';
import { SignUpDto } from './dto/sign-up.dto';

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
    // return;
  }

  //   @Post('login')
  //   //   @UseGuards(LocalAuthGuard)
  //   async signIn(
  //     @Res({ passthrough: true }) res: Response, // cookie를 설정하기 위해 express의 Response를 사용
  //     @GetUser() user: UserModel,
  //     @ClientIp() clientIp: string,
  //   ) {
  //     const { accessToken, refreshCookieOption, refreshToken } =
  //       this.authService.issueLoginTokenSet(user);
  //     await this.authService.updateLastLoginIp(user.id, clientIp);

  //     res.cookie('token', refreshToken, refreshCookieOption);

  //     return { accessToken };
  //   }

  //   @Post('silent')
  //   //   @UseGuards(JwtRefreshGuard)
  //   async silent(
  //     @Res({ passthrough: true }) res: Response,
  //     @GetUser() user: UserProfile,
  //     @ClientIp() clientIp: string,
  //   ) {
  //     const { accessToken, refreshToken, refreshCookieOption } =
  //       this.authService.issueLoginTokenSet(user);
  //     await this.authService.updateLastLoginIp(user.id, clientIp);

  //     res.cookie('token', refreshToken, refreshCookieOption);
  //     return { accessToken };
  //   }

  //   @Get('me')
  //   //   @UseGuards(JwtAccessGuard)
  //   async me(@GetUser() user: UserProfile) {
  //     return this.authService.formatUser(user);
  //   }
}
