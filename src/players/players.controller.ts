import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Ranking } from '../entities/Ranking';
import { Repository } from 'typeorm';
import { SportRankings } from '../entities/SportRankings';
import { PlayerCareer } from '../entities/PlayerCareer';
import { Player } from '../entities/Player';
import { PlayerTransfer } from '../entities/PlayerTransfer';
import { flattenResponse } from '../utils';

@Controller('v1/players')
@ApiTags('players')
export class PlayersController {
  constructor(
    @InjectRepository(Player) private playerRepo: Repository<Player>,
    @InjectRepository(PlayerTransfer)
    private playerTransferRepo: Repository<PlayerTransfer>,
    @InjectRepository(PlayerCareer)
    private playerCareerRepo: Repository<PlayerCareer>,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get player details' })
  async getDetails(@Param('id') playerId: string) {
    try {
      return {
        data: flattenResponse(
          await this.playerRepo.findOneOrFail({
            id: playerId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/career')
  @ApiOperation({ summary: 'Get player career information' })
  async getCareer(@Param('id') playerId: string) {
    try {
      return {
        data: flattenResponse(
          await this.playerCareerRepo.findOneOrFail({
            id: playerId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/transfers')
  @ApiOperation({ summary: 'Get player transfer information' })
  async getTransfers(@Param('id') playerId: string) {
    try {
      return {
        data: flattenResponse(
          await this.playerTransferRepo.findOneOrFail({
            id: playerId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }
}
