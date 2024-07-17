import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUser } from 'src/auth/decorators';
import { JwtAccessGuard } from 'src/auth/guards';
import { TeamModel, UserModel } from 'src/common/models';
import { PrismaService } from 'src/common/prisma';

import { CreateTeamAndJoinOutputDto, CreateTeamMemberDto, JoinTeamDto } from './dto';
import { CreateTeamAndJoinDto } from './dto/create-team-and-join.dto';
import { UpdateTeamPositionDto } from './dto/update-team-position.dto';
import { TeamsService } from './teams.service';

@Resolver()
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => [TeamModel])
  @UseGuards(JwtAccessGuard)
  async getTeams() {
    return await this.teamsService.getAllTeams();
  }

  @Mutation(() => CreateTeamAndJoinOutputDto)
  @UseGuards(JwtAccessGuard)
  async createTeam(
    @GetUser() user: UserModel,
    @Args('createTeamAndJoinDto') createTeamAndJoinDto: CreateTeamAndJoinDto,
  ) {
    return this.teamsService.createTeamAndJoin(user, createTeamAndJoinDto);
  }

  @Mutation(() => CreateTeamAndJoinOutputDto)
  @UseGuards(JwtAccessGuard)
  async joinTeam(@GetUser() user: UserModel, @Args('joinTeamDto') joinTeamDto: JoinTeamDto) {
    const teamJoinEndTime = new Date(
      this.configService.get<string>('TEAM_JOIN_END_TIME') ?? '2024-07-29 00:00:00',
    );

    if (new Date().getTime() > teamJoinEndTime.getTime())
      throw new BadRequestException(
        '팀 참가는 07/18 23:59:59까지 가능해요. 참가 시간이 이미 지났어요',
      );

    return await this.teamsService.joinTeam(user, joinTeamDto);
  }

  @Get('@me')
  @UseGuards(JwtAccessGuard)
  async getMyTeamInfo(@GetUser() user: UserModel) {
    if (!user.teamMember) throw new BadRequestException('팀에 가입되어 있지 않아요.');
    return await this.teamsService.getTeamInfo(user.teamMember.teamId);
  }

  @Delete('@me/leave')
  @UseGuards(JwtAccessGuard)
  async leaveTeam(@GetUser() user: UserModel) {
    return await this.teamsService.leaveTeam(user);
  }

  @Delete('@me')
  @UseGuards(JwtAccessGuard)
  async deleteTeam(@GetUser() user: UserModel) {
    return await this.teamsService.deleteTeamByLeader(user);
  }

  @Patch('@me/position')
  @UseGuards(JwtAccessGuard)
  async updateMemberPosition(
    @GetUser() user: UserModel,
    @Body() updateTeamMemberPosition: UpdateTeamPositionDto,
  ) {
    return await this.teamsService.updateMemberPosition(user.id, updateTeamMemberPosition);
  }

  @Get('all/members')
  @UseGuards(JwtAccessGuard)
  async getAllTeamMembers() {
    return await this.teamsService.getAllMembersWithStudentProfile();
  }

  @Get('@me/logs')
  @UseGuards(JwtAccessGuard)
  async getMyTeamLogs(@GetUser() user: UserModel) {
    return await this.teamsService.getMyTeamAllLogs(user.id);
  }

  // @Post('@me/upload')
  // @UseGuards(JwtAccessGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@GetUser() user: UserModel, @UploadedFile() uploadFile: Express.MulterS3.File) {
  //   if (!user.teamMember) throw new BadRequestException('소속 중인 팀이 없어요');

  //   const fileName = Buffer.from(uploadFile.originalname, 'ascii').toString('utf8');
  //   const file = await this.prismaService.file.create({
  //     data: {
  //       name: fileName,
  //       size: uploadFile.size,
  //       location: uploadFile.location,
  //       key: uploadFile.key,
  //       uploaderId: user.id,
  //     },
  //   });

  //   await this.teamsService.appendFileToTeamUpload(user.teamMember.teamId, file);
  //   return '';
  // }

  // @Get('@me/files/:fileId')
  // @UseGuards(JwtAccessGuard)
  // async getPresignedUrl(@GetUser() user: UserModel, @Param('fileId') fileId: string) {
  //   return await this.teamsService.downloadTeamFile(user, fileId);
  // }

  @Get('@me/files')
  @UseGuards(JwtAccessGuard)
  async getMyTeamFiles(@GetUser() user: UserModel) {
    return await this.teamsService.getMyTeamFiles(user.id);
  }
}
