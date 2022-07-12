import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './players.controller';
import { Player } from '../entities/Player';
import { PlayerCareer } from '../entities/PlayerCareer';
import { PlayerTransfer } from '../entities/PlayerTransfer';

@Module({
  imports: [TypeOrmModule.forFeature([Player, PlayerCareer, PlayerTransfer])],
  controllers: [PlayersController],
})
export class PlayersModule {}
