import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../entities/Player';
import { Repository } from 'typeorm';
import { PlayerTransfer } from '../entities/PlayerTransfer';
import { PlayerCareer } from '../entities/PlayerCareer';
import { TournamentStage } from '../entities/TournamentStage';
import { Tournament } from '../entities/Tournament';
import { TournamentStandings } from '../entities/TournamentStandings';
import { Season } from '../entities/Season';
import { flattenResponse } from '../utils';

@Controller('v1/tournaments')
@ApiTags('tournaments')
export class TournamentsController {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepo: Repository<Tournament>,
    @InjectRepository(TournamentStage)
    private tournamentStageRepo: Repository<TournamentStage>,
    @InjectRepository(TournamentStandings)
    private tournamentStandingsRepo: Repository<TournamentStandings>,
    @InjectRepository(Season) private seasonRepo: Repository<Season>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all tournaments by sport' })
  @ApiImplicitQuery({
    name: 'league_name',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'country',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'timestamp_start',
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'timestamp_end',
    required: false,
    type: String,
  })
  async getList(
    @Query('sport_id') sportId: string,
    @Query('league_name') league?: string,
    @Query('country') country?: string,
    @Query('timestamp_start') timestamp_start?: string,
    @Query('timestamp_end') timestamp_end?: string,
  ) {
    try {
      return {
        data: (
          await this.tournamentRepo.query(
            `SELECT * FROM tournament WHERE data->>'SPORT_ID'=$1`,
            [sportId],
          )
        ).map(flattenResponse),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get tournament results' })
  getResults(@Param('id') tournamentId: string): object {
    return {};
  }

  @Get(':id/fixtures')
  @ApiOperation({ summary: 'Get tournament fixtures' })
  getFixtures(@Param('id') tournamentId: string): object {
    return {};
  }

  @Get(':id/seasons')
  @ApiOperation({ summary: 'Get tournament seasons' })
  async getSeasons(@Param('id') tournamentId: string) {
    try {
      return {
        data: (
          await this.seasonRepo.query(
            `SELECT * FROM season WHERE data->>'TOURNAMENT_ID'=$1`,
            [tournamentId],
          )
        ).map(flattenResponse),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/standings')
  @ApiOperation({ summary: 'Get tournament standings' })
  async getStandings(@Param('id') tournamentId: string) {
    try {
      return {
        data: flattenResponse(
          await this.tournamentStandingsRepo.findOneOrFail({
            id: tournamentId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/stages')
  @ApiOperation({ summary: 'Get tournament stages' })
  async getStageList(@Param('id') tournamentId: string) {
    try {
      return {
        data: flattenResponse(
          await this.tournamentStageRepo.findOneOrFail({
            id: tournamentId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/stages/:stageId')
  @ApiOperation({ summary: 'Get stage details' })
  async getStageDetails(
    @Param('id') tournamentId: string,
    @Param('stageId') stageId: string,
  ) {
    try {
      return {
        data: flattenResponse(
          await this.tournamentStageRepo.findOneOrFail({
            id: stageId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }
}
