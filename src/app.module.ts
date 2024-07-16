import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env' : '.env.local',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true, // Set to false in production. It enables the GraphQL Playground where you can test your queries.
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        const originalError = error.extensions?.originalError as Error;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
