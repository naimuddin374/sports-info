import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { flattenResponse } from '../utils';
import { Ranking } from '../entities/Ranking';
import { SportRankings } from '../entities/SportRankings';

@Controller('v1/rankings')
@ApiTags('rankings')
export class RankingsController {
  constructor(
    @InjectRepository(Ranking) private rankingRepo: Repository<Ranking>,
    @InjectRepository(SportRankings)
    private sportRankingRepo: Repository<SportRankings>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all rankings for a sport' })
  async getList(@Query('sport_id') sport_id: string) {
    return {
      data: flattenResponse(
        await this.sportRankingRepo.findOne({
          id: sport_id,
        }),
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ranking details' })
  async getDetails(@Param('id') ranking_id: string) {
    return {
      data: (
        await this.rankingRepo.find({
          id: ranking_id,
        })
      ).map(flattenResponse),
    };
  }
}
