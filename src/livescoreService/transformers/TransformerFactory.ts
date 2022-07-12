import { Injectable } from '@nestjs/common';
import { SportTransformer } from './SportTransformer';
import { BaseTransformer } from './BaseTransformer';
import { RankingListTransformer } from './RankingListTransformer';
import { RankingTransformer } from './RankingTransformer';
import { EventNewsTransformer } from './EventNewsTransformer';
import { EventListTransformer } from './EventListTransformer';
import { EventPointsTransformer } from './EventPointsTransformer';
import { EventFallOfWicketsTransformer } from './EventFallOfWicketsTransformer';
import { EventScorecardTransformer } from './EventScorecardTransformer';
import { EventReportTransformer } from './EventReportTransformer';
import { EventLiveUpdateTransformer } from './EventLiveUpdateTransformer';
import { EventHighlightTransformer } from './EventHighlightTransformer';
import { EventH2hTransformer } from './EventH2hTransformer';
import { EventStatisticsTransformer } from './EventStatisticsTransformer';
import { EventOddsTransformer } from './EventOddsTransformer';
import { EventLastChangeTransformer } from './EventLastChangeTransformer';
import { EventPreviewTransformer } from './EventPreviewTransformer';
import { EventBallByBallTransformer } from './EventBallByBallTransformer';
import { EventMissingPlayersTransformer } from './EventMissingPlayersTransformer';
import { EventCommentaryTransformer } from './EventCommentaryTransformer';
import { EventLineupTransformer } from './EventLineupTransformer';
import { EventCommentaryAltTransformer } from './EventCommentaryAltTransformer';
import { EventSummaryTransformer } from './EventSummaryTransformer';
import { EventDataTransformer } from './EventDataTransformer';
import { EventLiveListTransformer } from './EventLiveListTransformer';
import { EventLiveOddsTranformer } from './EventLiveOddsTranformer';
import { TeamResultTransformer } from './TeamResultTransformer';
import { TeamFixtureTransformer } from './TeamFixtureTransformer';
import { TeamNewsTransformer } from './TeamNewsTransformer';
import { TeamSquadTransformer } from './TeamSquadTransformer';
import { TeamTransferTransformer } from './TeamTransferTransformer';
import { TeamDataTransformer } from './TeamDataTransformer';
import { TournamentStageDataTransformer } from './TournamentStageDataTransformer';
import { TournamentStandingsTransformer } from './TournamentStandingsTransformer';
import { TournamentSeasonsDataTransformer } from './TournamentSeasonsDataTransformer';
import { TournamentResultsTransformer } from './TournamentResultsTransformer';
import { TournamentStagesTransformer } from './TournamentStagesTransformer';
import { TournamentListTransformer } from './TournamentListTransformer';
import { TournamentPopularTransformer } from './TournamentPopularTransformer';
import { PlayerTransferTransformer } from './PlayerTransferTransformer';
import { PlayerDataTransformer } from './PlayerDataTransformer';
import { PlayerCareerTransformer } from './PlayerCareerTransformer';
import { PlayerLastEventTransformer } from './PlayerLastEventTransformer';

export type LIVESCORE_URLS =
  | 'sports/events-count'
  | 'rankings/list'
  | 'rankings/data'
  | 'events/news'
  | 'events/list'
  | 'events/points-history'
  | 'events/fall-of-wickets'
  | 'events/scorecard'
  | 'events/report'
  | 'events/live-update'
  | 'events/highlights'
  | 'events/h2h'
  | 'events/statistics'
  | 'events/odds'
  | 'events/last-change'
  | 'events/preview'
  | 'events/ball-by-ball'
  | 'events/missing-players'
  | 'events/commentary'
  | 'events/lineups'
  | 'events/commentary-alt'
  | 'events/summary'
  | 'events/data'
  | 'events/live-list'
  | 'events/live-odds'
  | 'teams/results'
  | 'teams/fixtures'
  | 'teams/news'
  | 'teams/squad'
  | 'teams/transfers'
  | 'teams/data'
  | 'tournaments/stages/data'
  | 'tournaments/standings'
  | 'tournaments/seasons/data'
  | 'tournaments/results'
  | 'tournaments/stages'
  | 'tournaments/list'
  | 'tournaments/popular'
  | 'players/transfers'
  | 'players/data'
  | 'players/career'
  | 'players/last-events';

@Injectable()
export class TransformerFactory {
  private URL_TRANSFORMER_MAP: Record<
    LIVESCORE_URLS,
    { new (): BaseTransformer }
  > = {
    'sports/events-count': SportTransformer,
    'rankings/list': RankingListTransformer,
    'rankings/data': RankingTransformer,
    'events/news': EventNewsTransformer,
    'events/list': EventListTransformer,
    'events/points-history': EventPointsTransformer,
    'events/fall-of-wickets': EventFallOfWicketsTransformer,
    'events/scorecard': EventScorecardTransformer,
    'events/report': EventReportTransformer,
    'events/live-update': EventLiveUpdateTransformer,
    'events/highlights': EventHighlightTransformer,
    'events/h2h': EventH2hTransformer,
    'events/statistics': EventStatisticsTransformer,
    'events/odds': EventOddsTransformer,
    'events/last-change': EventLastChangeTransformer,
    'events/preview': EventPreviewTransformer,
    'events/ball-by-ball': EventBallByBallTransformer,
    'events/missing-players': EventMissingPlayersTransformer,
    'events/commentary': EventCommentaryTransformer,
    'events/lineups': EventLineupTransformer,
    'events/commentary-alt': EventCommentaryAltTransformer,
    'events/summary': EventSummaryTransformer,
    'events/data': EventDataTransformer,
    'events/live-list': EventLiveListTransformer,
    'events/live-odds': EventLiveOddsTranformer,
    'teams/results': TeamResultTransformer,
    'teams/fixtures': TeamFixtureTransformer,
    'teams/news': TeamNewsTransformer,
    'teams/squad': TeamSquadTransformer,
    'teams/transfers': TeamTransferTransformer,
    'teams/data': TeamDataTransformer,
    'tournaments/stages/data': TournamentStageDataTransformer,
    'tournaments/standings': TournamentStandingsTransformer,
    'tournaments/seasons/data': TournamentSeasonsDataTransformer,
    'tournaments/results': TournamentResultsTransformer,
    'tournaments/stages': TournamentStagesTransformer,
    'tournaments/list': TournamentListTransformer,
    'tournaments/popular': TournamentPopularTransformer,
    'players/transfers': PlayerTransferTransformer,
    'players/data': PlayerDataTransformer,
    'players/career': PlayerCareerTransformer,
    'players/last-events': PlayerLastEventTransformer,
  };

  private _transformerCache = {};

  transformerForUrl(url: LIVESCORE_URLS): BaseTransformer {
    if (!this._transformerCache[url]) {
      this._transformerCache[url] = new this.URL_TRANSFORMER_MAP[url]();
    }

    return this._transformerCache[url];
  }

  allTransformers(): Partial<Record<LIVESCORE_URLS, BaseTransformer>> {
    const result: Partial<Record<LIVESCORE_URLS, BaseTransformer>> = {};
    Object.keys(this.URL_TRANSFORMER_MAP).forEach((key: LIVESCORE_URLS) => {
      result[key] = this.transformerForUrl(key);
    });

    return result;
  }
}
