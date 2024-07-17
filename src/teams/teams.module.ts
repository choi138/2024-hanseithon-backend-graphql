import * as path from 'path';

import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { S3Client } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import { Request } from 'express';
import * as multerS3 from 'multer-s3';

import { UserModel } from 'src/common/models';
import { PrismaModule } from 'src/common/prisma';
import { LogModule } from 'src/log/log.module';

import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    LogModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const s3Client = new S3Client({
          region: 'ap-northeast-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });

        return {
          // https://github.com/anacronw/multer-s3
          storage: multerS3({
            s3: s3Client,
            bucket: configService.get<string>('AWS_S3_BUCKET_NAME'),
            key: (req: Request & { user: UserModel }, file, done) => {
              if (!req.user.teamMember) done(new BadRequestException('팀에 속해있지 않아요'));

              const fileUploadEntTime = new Date(
                configService.get<string>('FILE_UPLOAD_END_TIME') ?? '2025-07-21 14:00:00',
              );

              if (new Date().getTime() > fileUploadEntTime.getTime())
                done(new BadRequestException('파일 업로드 기간이 지났어요'));

              const encodingName = Buffer.from(file.originalname, 'hex').toString('utf8');
              const timestamp = new Date().getTime();
              const ext = path.extname(encodingName);
              const basename = path.basename(encodingName, ext);

              done(null, `${req.user.teamMember.teamId}/${basename}_${timestamp}${ext}`);
              // req.user.teamMember.teamId = aws에 저장되는 폴더 이름
              // ${basename}_${timestamp}${ext} = aws에 저장되는 파일 이름
            },
          }),
          limits: {
            files: 1,
            fileSize: 1024 * 1024 * 1024 * 5, // GB
          },
        };
      },
    }),
  ],
  providers: [TeamsService, TeamsResolver],
})
export class TeamsModule {}
