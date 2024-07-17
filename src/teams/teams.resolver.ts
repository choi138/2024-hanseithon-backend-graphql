import { BadRequestException, Get, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUser } from 'src/auth/decorators';
import { JwtAccessGuard } from 'src/auth/guards';
import { UserModel } from 'src/common/models';
import { PrismaService } from 'src/common/prisma';

import {
  TeamOutputDto,
  JoinTeamDto,
  CreateTeamAndJoinDto,
  UpdateTeamPositionDto,
  TeamMemberOutputDto,
  TeamLogsOutputDto,
} from './dto';
import { TeamsService } from './teams.service';

@Resolver()
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => [TeamOutputDto])
  @UseGuards(JwtAccessGuard)
  async getTeams() {
    return await this.teamsService.getAllTeams();
  }

  @Mutation(() => TeamOutputDto)
  @UseGuards(JwtAccessGuard)
  async createTeam(
    @GetUser() user: UserModel,
    @Args('createTeamAndJoinDto') createTeamAndJoinDto: CreateTeamAndJoinDto,
  ): Promise<TeamOutputDto> {
    return this.teamsService.createTeamAndJoin(user, createTeamAndJoinDto);
  }

  @Mutation(() => TeamOutputDto)
  @UseGuards(JwtAccessGuard)
  async joinTeam(
    @GetUser() user: UserModel,
    @Args('joinTeamDto') joinTeamDto: JoinTeamDto,
  ): Promise<TeamOutputDto> {
    const teamJoinEndTime = new Date(
      this.configService.get<string>('TEAM_JOIN_END_TIME') ?? '2024-07-29 00:00:00',
    );

    if (new Date().getTime() > teamJoinEndTime.getTime())
      throw new BadRequestException(
        '팀 참가는 07/18 23:59:59까지 가능해요. 참가 시간이 이미 지났어요',
      );

    return await this.teamsService.joinTeam(user, joinTeamDto);
  }

  @Query(() => TeamOutputDto)
  @UseGuards(JwtAccessGuard)
  async getMyTeamInfo(@GetUser() user: UserModel): Promise<TeamOutputDto> {
    if (!user.teamMember) throw new BadRequestException('팀에 가입되어 있지 않아요.');
    return await this.teamsService.getTeamInfo(user.teamMember.teamId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAccessGuard)
  async leaveTeam(@GetUser() user: UserModel): Promise<boolean> {
    return await this.teamsService.leaveTeam(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAccessGuard)
  async deleteTeam(@GetUser() user: UserModel): Promise<boolean> {
    return await this.teamsService.deleteTeamByLeader(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAccessGuard)
  async updateMemberPosition(
    @GetUser() user: UserModel,
    @Args('updateTeamMemberPosition') updateTeamMemberPosition: UpdateTeamPositionDto,
  ): Promise<boolean> {
    return await this.teamsService.updateMemberPosition(user.id, updateTeamMemberPosition);
  }

  @Query(() => [TeamMemberOutputDto])
  @UseGuards(JwtAccessGuard)
  async getAllTeamMembers() {
    return await this.teamsService.getAllMembersWithStudentProfile();
  }

  @Query(() => [TeamLogsOutputDto])
  @UseGuards(JwtAccessGuard)
  async getMyTeamLogs(@GetUser() user: UserModel) {
    return await this.teamsService.getMyTeamAllLogs(user.id);
  }

  // TODO: 시간되면 https://safnaj.medium.com/building-graphql-api-for-effortless-file-uploads-to-aws-s3-cf9ba8b5bd12 ㄱㄱ

  // @Mutation(() => Boolean)
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
  //   return true;
  // }

  // @Get('@me/files/:fileId')
  // @UseGuards(JwtAccessGuard)
  // async getPresignedUrl(@GetUser() user: UserModel, @Param('fileId') fileId: string) {
  //   return await this.teamsService.downloadTeamFile(user, fileId);
  // }

  // @Get('@me/files')
  // @UseGuards(JwtAccessGuard)
  // async getMyTeamFiles(@GetUser() user: UserModel) {
  //   return await this.teamsService.getMyTeamFiles(user.id);
  // }
}
