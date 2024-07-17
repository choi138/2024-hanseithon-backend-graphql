import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';

import { PrismaService } from 'src/common/prisma';

import { CreateStudentDto, isExistStudentDto } from './dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createStudent(
    userId: User['id'],
    { department, grade, number, classroom }: CreateStudentDto,
  ) {
    return await this.prismaService.student.create({
      data: { userId, department, number, classroom, grade },
    });
  }

  public async updateStudent(
    userId: User['id'],
    { department, grade, number, classroom }: Partial<CreateStudentDto>,
  ) {
    return await this.prismaService.student.update({
      where: { userId },
      data: { department, grade, number, classroom },
    });
  }

  public async findByUserId(userId: User['id']) {
    const student = await this.prismaService.student.findUnique({ where: { userId } });
    return { isExist: Boolean(student), student: student || null };
  }

  public async isExistStudent({ department, grade, classroom, number }: isExistStudentDto) {
    const student = await this.prismaService.student.findFirst({
      where: { department, grade, classroom, number },
    });

    return { isExist: Boolean(student), student: student || null };
  }
}
