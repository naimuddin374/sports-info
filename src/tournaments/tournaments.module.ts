import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentsController } from './tournaments.controller';
import { Tournament } from '../entities/Tournament';
import { TournamentStage } from '../entities/TournamentStage';
import { Season } from '../entities/Season';
import { TournamentStandings } from '../entities/TournamentStandings';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      TournamentStage,
      TournamentStandings,
      Season,
    ]),
  ],
  controllers: [TournamentsController],
})
export class TournamentsModule {}
