import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';
import { TeamNews } from '../entities/TeamNews';
import { TeamSquad } from '../entities/TeamSquad';
import { Team } from '../entities/Team';
import { TeamTransfer } from '../entities/TeamTransfer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamNews, TeamSquad, TeamTransfer]),
  ],
  controllers: [TeamsController],
})
export class TeamsModule {}
