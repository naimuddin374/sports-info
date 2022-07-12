import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/Event';
import { Repository } from 'typeorm';
import { EventBallByBall } from '../entities/EventBallByBall';
import { EventCommentary } from '../entities/EventCommentary';
import { EventCommentaryAlt } from '../entities/EventCommentaryAlt';
import { EventFallOfWickets } from '../entities/EventFallOfWickets';
import { EventHighlight } from '../entities/EventHighlight';
import { EventMissingPlayers } from '../entities/EventMissingPlayers';
import { EventNews } from '../entities/EventNews';
import { EventOdds } from '../entities/EventOdds';
import { EventPoints } from '../entities/EventPoints';
import { EventPreview } from '../entities/EventPreview';
import { EventReport } from '../entities/EventReport';
import { EventScorecard } from '../entities/EventScorecard';
import { EventStartingLineup } from '../entities/EventStartingLineup';
import { EventStatistics } from '../entities/EventStatistics';
import { EventSummary } from '../entities/EventSummary';
import { flattenResponse } from '../utils';

@Controller('v1/events')
@ApiTags('events')
export class EventsController {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(EventBallByBall)
    private eventBallByBallRepository: Repository<EventBallByBall>,
    @InjectRepository(EventCommentary)
    private eventCommentaryRepository: Repository<EventCommentary>,
    @InjectRepository(EventCommentaryAlt)
    private eventCommentaryAltRepository: Repository<EventCommentaryAlt>,
    @InjectRepository(EventFallOfWickets)
    private eventFallOfWicketsRepository: Repository<EventFallOfWickets>,
    @InjectRepository(EventHighlight)
    private eventHighlightRepository: Repository<EventHighlight>,
    @InjectRepository(EventMissingPlayers)
    private eventMissingPlayersRepository: Repository<EventMissingPlayers>,
    @InjectRepository(EventNews)
    private eventNewsRepository: Repository<EventNews>,
    @InjectRepository(EventOdds)
    private eventOddsRepository: Repository<EventOdds>,
    @InjectRepository(EventPoints)
    private eventPointsRepository: Repository<EventPoints>,
    @InjectRepository(EventPreview)
    private eventPreviewRepository: Repository<EventPreview>,
    @InjectRepository(EventReport)
    private eventReportRepository: Repository<EventReport>,
    @InjectRepository(EventScorecard)
    private eventScorecardRepository: Repository<EventScorecard>,
    @InjectRepository(EventStartingLineup)
    private eventStartingLineupRepository: Repository<EventStartingLineup>,
    @InjectRepository(EventStatistics)
    private eventStatisticsRepository: Repository<EventStatistics>,
    @InjectRepository(EventSummary)
    private eventSummaryRepository: Repository<EventSummary>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all events by sport' })
  getList(
    @Query('sport_id') sportId: string,
    @Query('team_id') teamId?: string,
    @Query('team_name') teamName?: string,
    @Query('league_name') league?: string,
    @Query('country') country?: string,
    @Query('round') round?: string,
    @Query('stage') stage?: string,
    @Query('tournament_name') tournament?: string,
    @Query('tournament_type') tournament_type?: string,
    @Query('timestamp_start') timestamp_start?: string,
    @Query('timestamp_end') timestamp_end?: string,
  ) {
    return {};
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details' })
  async getDetails(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/ball-by-ball')
  @ApiOperation({ summary: 'Get event ball data' })
  async getBallByBall(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventBallByBallRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/commentary')
  @ApiOperation({ summary: 'Get event commentary' })
  async getCommentary(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventCommentaryRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/fall-of-wickets')
  @ApiOperation({ summary: 'Get wicket fall data' })
  async getWicketFall(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventBallByBallRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/highlights')
  @ApiOperation({ summary: 'Get event highlights' })
  async getHighlights(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventHighlightRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/lineups')
  @ApiOperation({ summary: 'Get event lineups' })
  async getLineups(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventStartingLineupRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/odds')
  @ApiOperation({ summary: 'Get event odds' })
  async getOdds(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventOddsRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/points-history')
  @ApiOperation({ summary: 'Get event points' })
  async getPoints(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventPointsRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Get event preview' })
  async getPreview(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventPreviewRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/report')
  @ApiOperation({ summary: 'Get event report' })
  async getReport(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventReportRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/scorecard')
  @ApiOperation({ summary: 'Get event scorecard' })
  async getScorecard(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventScorecardRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get event statistics' })
  async getStatistics(@Param('id') eventId: string) {
    try {
      return {
        data: flattenResponse(
          await this.eventStatisticsRepository.findOneOrFail({
            id: eventId,
          }),
        ),
      };
    } catch (exception) {
      throw new NotFoundException();
    }
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Summarize event statistics' })
  async getSummaryStatistics(
    @Query('sport_id') sport_id?: string,
    @Query('team_id') team_id?: string,
    @Query('team_name') team_name?: string,
    @Query('last_count') n?: string,
    @Query('timestamp_start') timestamp_start?: string,
    @Query('timestamp_end') timestamp_end?: string,
  ) {
    return {};
  }
}
