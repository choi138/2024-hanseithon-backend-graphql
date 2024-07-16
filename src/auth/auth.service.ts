import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// import { StudentsService } from 'src/students/students.service';

import { UserModel } from 'src/common/models';
import { UsersService } from 'src/users/users.service';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private bcryptNumber: number;
  constructor(
    private readonly usersService: UsersService,
    // private readonly studentsService: StudentsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.bcryptNumber = 10;
  }

  public async signUp({ email, password, name }: SignUpDto): Promise<UserModel> {
    const { isExist: existUser } = await this.usersService.isExistUser(email);
    if (existUser) throw new ConflictException('이미 존재하는 유저입니다.');

    // const { isExist: existStudent } =
    //   await this.studentsService.isExistStudent(student);
    // if (existStudent)
    //   throw new ConflictException(
    //     '이미 가입된 학번이에요. 학생회에 직접 문의해주세요.',
    //   );

    const hashedPassword = await bcrypt.hash(password, this.bcryptNumber);
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    // await this.studentsService.createStudent(user.id, student);

    const { user: userWithStudent } = await this.usersService.findById(user.id);

    return userWithStudent;
  }

  public async signIn({ email, password }: SignInDto) {
    const { isExist: existUser, user } = await this.usersService.isExistUser(email);
    if (!existUser) throw new UnauthorizedException('이메일/비밀번호를 확인해주세요.');

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('이메일/비밀번호를 확인해주세요.');

    delete user.password;
    return user;
  }

  public async updateLastLoginIp(userId: User['id'], ip: string) {
    const user = await this.usersService.updateUser(userId, {
      lastLoginIp: ip,
      lastLoginAt: new Date(),
    });

    return user;
  }

  public issueLoginTokenSet(user: UserModel) {
    const accessToken = this.issueJwtToken({ sub: user.id, role: user.role }, true);
    const refreshToken = this.issueJwtToken({ sub: user.id, role: user.role }, false);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'prod';

    return {
      accessToken,
      refreshToken,
      refreshCookieOption: {
        domain: isProduction ? 'localhost' : 'localhost', // 특정 도메인에서만 쿠키를 전송하도록 설정
        maxAge: 60 * 60 * 24 * 1000, // 24시간 후 만료
        httpOnly: false, // 자바스크립트에서 쿠키에 접근하지 못하도록 설정
        secure: isProduction, // production이면 https만 허용
      },
    };
  }

  public issueJwtToken(payload: { sub: string; role: string }, isAccessToken: boolean) {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const token = this.jwtService.sign(payload, {
      secret: isAccessToken ? accessSecret : refreshSecret,
      expiresIn: isAccessToken ? '2h' : '1d',
    });

    return token;
  }

  public formatUser(user: UserModel) {
    // if (user.student) {
    //   delete user.student.id;
    //   delete user.student.userId;
    // }

    // if (user.teamMember) {
    //   delete user.teamMember.id;
    //   delete user.teamMember.userId;
    // }

    return user;
  }
}
