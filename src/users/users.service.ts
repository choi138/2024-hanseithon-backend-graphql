import { Injectable, NotFoundException } from '@nestjs/common';

import { UserModel } from 'src/common/models';
import { PrismaService } from 'src/common/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async isExistUser(email: UserModel['email']) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { student: true, teamMember: true },
    });
    return { isExist: Boolean(user), user: user || null };
  }

  public async findById(id: UserModel['id']) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { student: true, teamMember: true },
    });
    return { isExist: Boolean(user), user: user || null };
  }

  public async updateUser(
    id: UserModel['id'],
    data: Partial<Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>>, // 유저의 id, createdAt, updatedAt은 수정할 수 없도록 설정
  ) {
    return this.prismaService.user.update({ where: { id }, data });
  }

  public async createUser({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    return this.prismaService.user.create({ data: { email, name, password } });
  }

  public async deleteUser(id: UserModel['id']) {
    const { isExist: existUser } = await this.findById(id);
    if (!existUser) throw new NotFoundException('존재하지 않는 유저입니다.');
    return this.prismaService.user.delete({ where: { id } });
  }
}
