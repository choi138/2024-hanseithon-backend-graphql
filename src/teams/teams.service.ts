import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Team, TeamLogType, User, File } from '@prisma/client';

import { TeamModel, UserModel } from 'src/common/models';
import { PrismaService } from 'src/common/prisma';
import { generateRandomString } from 'src/common/utils';
// import { FilesService } from 'src/files/files.service';
import { LogService } from 'src/log/log.service';

import { TeamOutputDto, CreateTeamDto, CreateTeamMemberDto, JoinTeamDto } from './dto';
import { CreateTeamAndJoinDto } from './dto/create-team-and-join.dto';
import { UpdateTeamPositionDto } from './dto/update-team-position.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logService: LogService,
    // private readonly filesSerivce: FilesService,
  ) {}

  public async isUserHasTeam(userId: User['id']) {
    const teamMember = await this.prismaService.teamMember.findFirst({ where: { userId } });
    return { isExist: Boolean(teamMember), teamMember: teamMember || null };
  }

  public async findByTeamName(name: string) {
    const team = await this.prismaService.team.findFirst({ where: { name } });
    return { isExist: Boolean(team), team: team || null };
  }

  public async findByTeamId(teamId: Team['id']) {
    const team = await this.prismaService.team.findFirst({ where: { id: teamId } });
    return { isExist: Boolean(team), team: team || null };
  }

  public async findByTeamInviteCode(inviteCode: string) {
    const team = await this.prismaService.team.findFirst({ where: { inviteCode } });
    return { isExist: Boolean(team), team: team || null };
  }

  public async findTeamMember(userId: User['id'], teamId: Team['id']) {
    const teamMember = await this.prismaService.teamMember.findFirst({ where: { userId, teamId } });
    return { isExist: Boolean(teamMember), teamMember: teamMember || null };
  }

  public async getTeamInfo(teamId: Team['id']) {
    const { isExist: isTeamExist, team } = await this.findByTeamId(teamId);
    if (!isTeamExist) throw new NotFoundException('팀 정보를 찾을 수 없어요.');

    const teamMembers = await this.prismaService.teamMember.findMany({
      where: { teamId: team.id },
      include: { user: { include: { student: true } } },
    });

    const members = teamMembers.map(
      ({
        isLeader,
        position,
        user: {
          name,
          profileUrl,
          createdAt,
          student: { department, grade },
        },
      }) => {
        return {
          isLeader,
          position,
          name,
          student: { department, grade },
          profileUrl,
          createdAt,
        };
      },
    );

    return { ...team, members };
  }

  public async getAllTeams() {
    const teams = await this.prismaService.team.findMany();
    const teamInfos = await Promise.all(teams.map(({ id }) => this.getTeamInfo(id)));
    return teamInfos.map(({ inviteCode, ...teamInfo }) => teamInfo);
  }

  public async createTeam(userId: User['id'], { name, description, type }: CreateTeamDto) {
    const { isExist: isUserHasTeam } = await this.isUserHasTeam(userId);
    if (isUserHasTeam) throw new ConflictException('이미 소속중인 팀이 있어요');

    const { isExist: isSameTeamNameExist } = await this.findByTeamName(name);
    if (isSameTeamNameExist) throw new ConflictException('이미 사용 중인 팀명이에요.');

    const inviteCode = generateRandomString(6);

    const team = await this.prismaService.team.create({
      data: { name, type, description, inviteCode },
    });

    return team;
  }

  public async createTeamMember(
    userId: User['id'],
    teamId: Team['id'],
    { position, isLeader }: CreateTeamMemberDto & { isLeader: boolean },
  ) {
    const { isExist: isUserHasTeam } = await this.isUserHasTeam(userId);
    if (isUserHasTeam) throw new ConflictException('이미 소속중인 팀이 있어요');

    const teamMember = await this.prismaService.teamMember.create({
      data: {
        userId,
        teamId,
        position,
        isLeader,
      },
    });

    return teamMember;
  }

  public async createTeamAndJoin(
    user: UserModel,
    { name, type, description, position }: CreateTeamAndJoinDto,
  ) {
    const team = await this.createTeam(user.id, { name, type, description });
    await this.createTeamMember(user.id, team.id, { position, isLeader: true });

    this.logService.createTeamLog(TeamLogType.TEAM_CREATED, team.id, user.name);

    return await this.getTeamInfo(team.id);
  }

  public async joinTeam(user: UserModel, { position, inviteCode }: JoinTeamDto) {
    const { isExist: isUserHasTeam } = await this.isUserHasTeam(user.id);
    if (isUserHasTeam) throw new ConflictException('이미 소속중인 팀이 있어요');

    const { isExist: isTeamExist, team } = await this.findByTeamInviteCode(inviteCode);
    if (!isTeamExist) throw new NotFoundException('존재하지 않는 팀입니다.');

    const teamMembers = await this.prismaService.teamMember.findMany({
      where: { teamId: team.id },
    });
    if (teamMembers.length >= 4) throw new BadRequestException('팀 인원이 가득 찼어요.');

    await this.createTeamMember(user.id, team.id, { position, isLeader: false });
    await this.logService.createTeamLog(TeamLogType.TEAM_JOIN, team.id, user.name);

    return await this.getTeamInfo(team.id);
  }

  public async leaveTeam(user: UserModel, forceLeave?: boolean) {
    const { isExist, teamMember } = await this.isUserHasTeam(user.id);
    if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');

    if (teamMember.isLeader && !forceLeave)
      throw new BadRequestException('팀장은 팀을 탈퇴할 수 없어요.');

    await this.prismaService.teamMember.delete({ where: { id: teamMember.id } });

    if (!forceLeave)
      await this.logService.createTeamLog(TeamLogType.TEAM_LEFT, teamMember.teamId, user.name);

    return true;
  }

  public async deleteTeamByLeader(user: UserModel) {
    const { isExist, teamMember } = await this.isUserHasTeam(user.id);
    if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');
    if (!teamMember.isLeader)
      throw new BadRequestException('팀장으로 소속된 팀만 삭제할 수 있어요.');

    await this.prismaService.teamMember.deleteMany({ where: { teamId: teamMember.teamId } });

    await this.prismaService.team.delete({ where: { id: teamMember.teamId } });
    return true;
  }

  public async updateMemberPosition(userId: string, { position }: UpdateTeamPositionDto) {
    const { isExist: isUserTeamExits, teamMember: userTeamMemeber } =
      await this.isUserHasTeam(userId);
    if (!isUserTeamExits) throw new BadRequestException('팀에 가입되어 있지 않아요.');

    const { isExist, teamMember } = await this.findTeamMember(userId, userTeamMemeber.teamId);
    if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');

    await this.prismaService.teamMember.update({
      where: { id: teamMember.id },
      data: { position },
    });

    return true;
  }

  public async getAllMembersWithStudentProfile() {
    const teamMembers = await this.prismaService.teamMember.findMany({
      include: { user: { include: { student: true } }, team: true },
      orderBy: { createAt: 'desc' },
    });

    return teamMembers.map(
      ({
        position,
        team: { name: teamName },
        user: {
          name,
          profileUrl,
          createdAt,
          student: { grade, department },
        },
      }) => ({ position, name, profileUrl, createdAt, grade, department, teamName }),
    );
  }

  public async getMyTeamAllLogs(userId: User['id']) {
    const { isExist, teamMember } = await this.isUserHasTeam(userId);
    if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');

    const logs = this.logService.findAllTeamLogs(teamMember.teamId);

    return logs;
  }

  public async appendFileToTeamUpload(teamId: string, file: File) {
    return await this.prismaService.teamFile.create({
      data: { teamId, fileId: file.id },
    });
  }

  // public async downloadTeamFile(user: UserModel, fileId: string) {
  //   const { isExist, teamMember } = await this.isUserHasTeam(user.id);
  //   if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');

  //   const teamFile = await this.prismaService.teamFile.findFirst({
  //     where: { file: { id: fileId }, teamId: teamMember.teamId },
  //     include: { file: true },
  //   });

  //   if (!teamFile) throw new BadRequestException('파일을 찾을 수 없어요.');
  //   return this.filesSerivce.getPresignedUrl(teamFile.file.key);
  // }

  public async getMyTeamFiles(userId: User['id']) {
    const { isExist, teamMember } = await this.isUserHasTeam(userId);
    if (!isExist) throw new BadRequestException('팀에 가입되어 있지 않아요.');

    const teamFiles = await this.prismaService.teamFile.findMany({
      where: { teamId: teamMember.teamId },
      include: {
        file: { select: { id: true, name: true, size: true, uploader: true, uploadAt: true } },
      },
      orderBy: { file: { uploadAt: 'desc' } },
    });

    return teamFiles.map(({ file: { uploader, ...file } }) => ({
      ...file,
      location: `${
        process.env.NODE_ENV === 'prod' ? 'http://127.0.0.0.1:3030' : 'http://127.0.0.0.1:3030'
      }/teams/@me/files/${file.id}`,
      key: undefined,
      uploader: uploader.name,
    }));
  }
}
