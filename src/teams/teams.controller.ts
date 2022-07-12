import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { flattenResponse } from '../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from '../entities/Sport';
import { Repository } from 'typeorm';
import { Team } from '../entities/Team';
import { TeamSquad } from '../entities/TeamSquad';
import { TeamTransfer } from '../entities/TeamTransfer';
import { TeamNews } from '../entities/TeamNews';

@Controller('v1/teams')
@ApiTags('teams')
export class TeamsController {
  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(TeamNews)
    private teamNewsRepository: Repository<TeamNews>,
    @InjectRepository(TeamSquad)
    private teamSquadRepository: Repository<TeamSquad>,
    @InjectRepository(TeamTransfer)
    private teamTransferRepository: Repository<TeamTransfer>,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get team details' })
  async getDetails(@Param('id') teamId: string) {
    try {
      return {
        data: flattenResponse(
          await this.teamRepository.findOneOrFail({
            id: teamId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/transfers')
  @ApiOperation({ summary: 'Get team transfers' })
  async getTransfers(@Param('id') teamId: string) {
    try {
      return {
        data: flattenResponse(
          await this.teamTransferRepository.findOneOrFail({
            id: teamId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get team results' })
  async getResults(@Param('id') teamId: string) {
    return {};
  }

  @Get(':id/squad')
  @ApiOperation({ summary: 'Get team squads' })
  async getSquad(@Param('id') teamId: string) {
    try {
      return {
        data: flattenResponse(
          await this.teamSquadRepository.findOneOrFail({
            id: teamId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/news')
  @ApiOperation({ summary: 'Get team news' })
  async getNews(@Param('id') teamId: string) {
    try {
      return {
        data: flattenResponse(
          await this.teamNewsRepository.findOneOrFail({
            id: teamId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }
}
