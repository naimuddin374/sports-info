import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from '../entities/Event';
import { EventNews } from '../entities/EventNews';
import { EventCommentary } from '../entities/EventCommentary';
import { EventBallByBall } from '../entities/EventBallByBall';
import { EventCommentaryAlt } from '../entities/EventCommentaryAlt';
import { EventFallOfWickets } from '../entities/EventFallOfWickets';
import { EventHighlight } from '../entities/EventHighlight';
import { EventMissingPlayers } from '../entities/EventMissingPlayers';
import { EventOdds } from '../entities/EventOdds';
import { EventPoints } from '../entities/EventPoints';
import { EventPreview } from '../entities/EventPreview';
import { EventReport } from '../entities/EventReport';
import { EventScorecard } from '../entities/EventScorecard';
import { EventStartingLineup } from '../entities/EventStartingLineup';
import { EventStatistics } from '../entities/EventStatistics';
import { EventSummary } from '../entities/EventSummary';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventNews,
      EventCommentary,
      EventBallByBall,
      EventCommentaryAlt,
      EventFallOfWickets,
      EventHighlight,
      EventMissingPlayers,
      EventOdds,
      EventPoints,
      EventPreview,
      EventReport,
      EventScorecard,
      EventStartingLineup,
      EventStatistics,
      EventSummary,
    ]),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
