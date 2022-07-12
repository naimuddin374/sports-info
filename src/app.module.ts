import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivescoreServiceController } from './livescoreService/livescoreService.controller';
import { LiveScoreServiceService } from './livescoreService/livescoreService.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransformerFactory } from './livescoreService/transformers/TransformerFactory';
import { RateLock } from './entities/RateLock';
import { SportsModule } from './sports/sports.module';
import { RankingsModule } from './rankings/rankings.module';
import { PlayersModule } from './players/players.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TeamsModule } from './teams/teams.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/entities/*.js'],
        synchronize: configService.get('DB_SYNC', 'false') === 'true',
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    ConfigModule.forRoot(),
    SportsModule,
    RankingsModule,
    PlayersModule,
    TournamentsModule,
    TeamsModule,
    EventsModule,
  ],
  controllers: [AppController, LivescoreServiceController],
  providers: [
    AppService,
    LiveScoreServiceService,
    TransformerFactory,
    RateLock,
  ],
})
export class AppModule {}
