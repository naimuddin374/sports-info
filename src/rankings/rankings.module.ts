import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from '../entities/Ranking';
import { SportRankings } from '../entities/SportRankings';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking, SportRankings])],
  controllers: [RankingsController],
})
export class RankingsModule {}
