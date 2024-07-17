import { Injectable } from '@nestjs/common';

import { Team, TeamLogType } from '@prisma/client';

import { PrismaService } from 'src/common/prisma';

@Injectable()
export class LogService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createTeamLog(type: TeamLogType, teamId: Team['id'], memberName: string) {
    await this.prismaService.teamLog.create({ data: { type, teamId, memberName } });
  }

  public async findAllTeamLogs(
    teamId: Team['id'],
    type: TeamLogType[] = [TeamLogType.TEAM_CREATED, TeamLogType.TEAM_JOIN, TeamLogType.TEAM_LEFT],
  ) {
    return await this.prismaService.teamLog.findMany({
      where: { teamId, type: { in: type } },
      orderBy: { actionAt: 'desc' },
    });
  }
}
