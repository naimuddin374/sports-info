import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { merge } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, Observable } from 'rxjs';
import { TransformResult } from './transformers/BaseTransformer';
import { Connection } from 'typeorm';
import { BaseDataEntity } from '../entities/BaseDataEntity';
import { Sport } from '../entities/Sport';
import { Event } from '../entities/Event';
import {
  LIVESCORE_URLS,
  TransformerFactory,
} from './transformers/TransformerFactory';
import { RateLock } from '../entities/RateLock';
import { Tournament } from '../entities/Tournament';
import { SportRankings } from '../entities/SportRankings';
import { Ranking } from '../entities/Ranking';
import { EventBallByBall } from '../entities/EventBallByBall';
import { EventSummary } from '../entities/EventSummary';
import { EventCommentary } from '../entities/EventCommentary';
import { EventCommentaryAlt } from '../entities/EventCommentaryAlt';
import { EventStartingLineup } from '../entities/EventStartingLineup';
import { EventMissingPlayers } from '../entities/EventMissingPlayers';
import { EventPreview } from '../entities/EventPreview';
import { EventOdds } from '../entities/EventOdds';
import { EventStatistics } from '../entities/EventStatistics';
import { EventHighlight } from '../entities/EventHighlight';
import { EventReport } from '../entities/EventReport';
import { EventScorecard } from '../entities/EventScorecard';
import { EventFallOfWickets } from '../entities/EventFallOfWickets';
import { EventPoints } from '../entities/EventPoints';
import { TournamentStage } from '../entities/TournamentStage';
import { Season } from '../entities/Season';
import { TournamentStandings } from '../entities/TournamentStandings';
import { EventNews } from '../entities/EventNews';
import { Team } from '../entities/Team';
import { TeamNews } from '../entities/TeamNews';
import { TeamTransfer } from '../entities/TeamTransfer';
import { mangleString, unmangleString } from '../utils';
import { Player } from '../entities/Player';
import { PlayerCareer } from '../entities/PlayerCareer';
import { PlayerTransfer } from '../entities/PlayerTransfer';
import { PlayerLastEvents } from '../entities/PlayerLastEvents';
import { AxiosResponse } from 'axios';
import { TeamSquad } from '../entities/TeamSquad';

class RateLimitedException implements Error {
  message: string;
  name: string;
}

@Injectable()
export class LiveScoreServiceService {
  private apiBaseUrl = '';
  private apiKey = '';
  private apiHost = '';
  private httpQueue: {
    url: string;
    params: { [key: string]: string | number };
    resolve: any;
    reject: any;
  }[] = [];
  private httpQueueRunning = false;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private connection: Connection,
    private transformerFactory: TransformerFactory,
    private rateLock: RateLock,
  ) {
    this.apiBaseUrl = configService.get<string>('API_BASE_URL');
    this.apiHost = configService.get<string>('API_HOST');
    this.apiKey = configService.get<string>('API_KEY');
  }

  private async processHttp() {
    if (this.httpQueueRunning) {
      return;
    }

    this.httpQueueRunning = true;
    while (true) {
      const item = this.httpQueue.shift();
      if (!item) {
        this.httpQueueRunning = false;
        return;
      }

      const { url, params, resolve, reject } = item;
      const lock = await this.rateLock.acquireLock(
        'livescore',
        110,
        10000,
        this.connection.manager,
      );

      if (lock) {
        try {
          const response = await firstValueFrom(
            this.httpService.get(this.apiBaseUrl + url, {
              params,
              headers: {
                'X-RapidAPI-Host': this.apiHost,
                'X-RapidAPI-Key': this.apiKey,
              },
            }),
          );
          resolve(response);
        } catch (e) {
          console.log(
            e.response.status.toString() + ' on ' + url + params.toString(),
          );
          reject(e);
        } finally {
          await this.rateLock.releaseLock(
            'livescore',
            lock,
            this.connection.manager,
          );
        }
      } else {
        reject();
      }
    }
  }

  private getHttp(
    url: LIVESCORE_URLS,
    params?: { [key: string]: string | number },
  ): Promise<AxiosResponse<any, any>> {
    return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
      this.httpQueue.push({
        url,
        params,
        resolve,
        reject,
      });
      this.processHttp();
    });
  }

  private async getTransformed(
    url: LIVESCORE_URLS,
    params?: { [key: string]: string | number },
    defaultId?: string,
  ): Promise<TransformResult[]> {
    try {
      const response = await this.getHttp(url, params);

      if (response.status == 200) {
        return this.transformerFactory
          .transformerForUrl(url)
          .processData(response.data, defaultId);
      }
    } catch (exception) {}

    return [];
  }

  private async updateData(
    Entity: { new (): BaseDataEntity },
    data: TransformResult,
  ) {
    const record = await this.connection.manager.findOne(Entity, {
      external_id: data.external_id,
    });
    if (record) {
      record.data = merge(record.data, data.data);
      return record.save();
    } else {
      const record = new Entity();
      record.data = data.data;
      record.external_id = data.external_id;
      record.id = data.id;
      return record.save();
    }
  }

  async loadSports() {
    const sports = await this.getTransformed('sports/events-count', {
      timezone: '0',
      locale: 'en_GB',
    });
    await Promise.all(sports.map((sport) => this.updateData(Sport, sport)));
    return {
      sportsCount: sports.length,
    };
  }

  async loadHistoricalData(sportId: string) {
    return {
      //tournamentCount: await this.updateTournamentList(sportId, true),
      stageCount: await this.updateStageList(sportId, true),
    };
  }

  async updateCurrentData(sportId: string) {
    return {
      eventCount: await this.updateEventList(sportId),
      tournamentCount: await this.updateTournamentList(sportId, false),
      stageCount: await this.updateStageList(sportId, false),
      rankingsCount: await this.updateRankings(sportId),
    };
  }

  async updateLiveData(sportId: string) {
    const eventsAndTournaments = await this.getTransformed('events/live-list', {
      timezone: '0',
      sport_id: sportId,
      locale: 'en_GB',
    });

    await Promise.all(
      eventsAndTournaments.map(async (eventOrTournament) => {
        if (eventOrTournament.type === 'event') {
          await this.updateData(Event, eventOrTournament);
        }
      }),
    );

    return {
      eventCount: eventsAndTournaments.length,
    };
  }

  private async updateEventData(eventId: string) {
    const entityUrlMap: [LIVESCORE_URLS, { new (): BaseDataEntity }][] = [
      ['events/points-history', EventPoints],
      ['events/fall-of-wickets', EventFallOfWickets],
      ['events/scorecard', EventScorecard],
      ['events/report', EventReport],
      ['events/highlights', EventHighlight],
      ['events/statistics', EventStatistics],
      ['events/odds', EventOdds],
      ['events/preview', EventPreview],
      ['events/ball-by-ball', EventBallByBall],
      ['events/missing-players', EventMissingPlayers],
      ['events/commentary', EventCommentary],
      ['events/lineups', EventStartingLineup],
      ['events/commentary-alt', EventCommentaryAlt],
      ['events/summary', EventSummary],
    ];

    await Promise.all(
      entityUrlMap.map(async ([url, Entity]) => {
        return this.updateDataList(
          Entity,
          this.getTransformed(
            url,
            {
              event_id: eventId,
              locale: 'en_GB',
            },
            eventId,
          ),
        );
      }),
    );

    const news = await this.getTransformed('events/news', {
      event_id: eventId,
      locale: 'en_GB',
    });

    await Promise.all(
      news.map(async (entity) => {
        entity.data.EVENT_ID = eventId;
        return await this.updateData(EventNews, entity);
      }),
    );
  }

  private async updateDataList(
    Entity: {
      new (): BaseDataEntity;
    },
    data: Promise<TransformResult[]>,
    mapper: (e: TransformResult) => TransformResult = (e) => e,
  ) {
    const mappedData = (await data).map(mapper);
    await Promise.all(mappedData.map((e) => this.updateData(Entity, e)));
    return mappedData;
  }

  private async updateTeamData(teamId: string, sportId) {
    // Update core team object
    console.log(
      await this.updateDataList(
        Team,
        this.getTransformed('teams/data', {
          team_id: teamId,
          locale: 'en_GB',
          sport_id: sportId,
        }),
      ),
    );

    // Update news
    await this.updateDataList(
      TeamNews,
      this.getTransformed('teams/news', {
        team_id: teamId,
        locale: 'en_GB',
      }),
      (e) => {
        e.data.TEAM_ID = mangleString(teamId);
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    // Update transfers
    await this.updateDataList(
      TeamTransfer,
      this.getTransformed(
        'teams/transfers',
        {
          team_id: teamId,
          locale: 'en_GB',
          page: '1',
        },
        teamId,
      ),
      (e) => {
        e.data.TEAM_ID = mangleString(teamId);
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    // Update squad
    const squads = await this.updateDataList(
      TeamSquad,
      this.getTransformed(
        'teams/squad',
        {
          team_id: teamId,
          locale: 'en_GB',
          sport_id: sportId,
        },
        teamId,
      ),
      (e) => {
        e.data.TEAM_ID = mangleString(teamId);
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    await Promise.all(
      squads.map(async (squad) =>
        Promise.all(
          squad.data.map(
            async (group) =>
              await Promise.all(
                group.ITEMS.map(async (player) => {
                  return await this.updatePlayer(
                    unmangleString(player.PLAYER_ID),
                    sportId,
                  );
                }),
              ),
          ),
        ),
      ),
    );
  }

  private async updatePlayer(playerId: string, sportId: string) {
    await this.updateDataList(
      Player,
      this.getTransformed('players/data', {
        player_id: playerId,
        locale: 'en_GB',
        sport_id: sportId,
      }),
    );

    await this.updateDataList(
      PlayerCareer,
      this.getTransformed(
        'players/career',
        {
          player_id: playerId,
          locale: 'en_GB',
          sport_id: sportId,
        },
        playerId,
      ),
    );

    await this.updateDataList(
      PlayerTransfer,
      this.getTransformed('players/transfers', {
        player_id: playerId,
        locale: 'en_GB',
        sport_id: sportId,
      }),
      (e) => {
        e.data.PLAYER_ID = mangleString(playerId);
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    await this.updateDataList(
      PlayerLastEvents,
      this.getTransformed(
        'players/last-events',
        {
          player_id: playerId,
          locale: 'en_GB',
          sport_id: sportId,
        },
        playerId,
      ),
    );
  }

  private async updateTeams(teamIds: string[], sportId: string) {
    return await Promise.all(
      teamIds.map((teamId) => this.updateTeamData(teamId, sportId)),
    );
  }

  private async updateSeason(sportId: string, seasonId: string) {
    const seasonStages = await this.updateDataList(
      TournamentStage,
      this.getTransformed('tournaments/seasons/data', {
        season_id: seasonId,
        locale: 'en_GB',
      }),
      (e) => {
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    return Promise.all(
      seasonStages.slice(0, 2).map(async (stage) => {
        return this.updateTournamentStandingsData(
          unmangleString(stage.data.TOURNAMENT_STAGE_ID),
          seasonId,
          sportId,
          stage.data.TOURNAMENT_STAGE_STATS_TYPE == 'draw' ? 'draw' : 'home',
          true,
        );
      }),
    );
  }

  private async updateStageList(sportId: string, historical: boolean) {
    const stages = await this.getTransformed('tournaments/stages', {
      sport_id: sportId,
      locale: 'en_GB',
    });

    await Promise.all(
      stages.slice(0, 2).map(async (stage) => {
        const seasons = await this.updateDataList(
          Season,
          this.getTransformed('tournaments/stages/data', {
            tournament_stage_id: stage.external_id,
            locale: 'en_GB',
          }),
          (e) => {
            e.data.SPORT_ID = sportId;
            return e;
          },
        );
        return await Promise.all(
          seasons.slice(0, 2).map(async (season) => {
            return this.updateSeason(sportId, season.external_id);
          }),
        );
      }),
    );
  }

  private async updateTournamentList(sportId: string, historical: boolean) {
    const tournaments = await this.updateDataList(
      Tournament,
      this.getTransformed('tournaments/list', {
        sport_id: sportId,
        locale: 'en_GB',
      }),
      (e) => {
        e.data.SPORT_ID = sportId;
        return e;
      },
    );

    // Get current season standings if we're not in history mode
    if (!historical) {
      await Promise.all(
        tournaments.slice(0, 2).map(async (tournament) => {
          return this.updateSeason(
            sportId,
            unmangleString(tournament.data.ACTUAL_TOURNAMENT_SEASON_ID),
          );
        }),
      );
    }

    // Get events if we're in historical mode
    if (historical) {
      await Promise.all(
        tournaments.slice(0, 1).map(async (tournament) => {
          return await Promise.all(
            tournament.data.STAGES.map(async (stage) => {
              const events = await this.getTransformed('tournaments/results', {
                tournament_stage_id: unmangleString(stage.STAGE_ID),
                page: '1',
                locale: 'en_GB',
              });

              return await Promise.all(
                events.slice(0, 1).map(async (event) => {
                  if (event.type === 'event') {
                    await this.updateData(Event, event);
                    await this.updateEventData(event.external_id);
                  }
                }),
              );
            }),
          );
        }),
      );
    }

    return tournaments.length;
  }

  private async updateTournamentStandingsData(
    tournamentStageId: string,
    tournamentSeasonId: string,
    sportId: string,
    standing_type: string,
    updateTeams?: boolean,
  ) {
    const stages = await this.updateDataList(
      TournamentStandings,
      this.getTransformed(
        'tournaments/standings',
        {
          tournament_season_id: tournamentSeasonId,
          tournament_stage_id: tournamentStageId,
          locale: 'en_GB',
          standing_type: standing_type,
        },
        tournamentStageId,
      ),
    );

    if (updateTeams) {
      await Promise.all(
        stages.map(
          async (stage) =>
            await Promise.all(
              stage.data.map(async (group) =>
                Promise.all(
                  group.ROWS.slice(0, 2).map(async (row) => {
                    return await this.updateTeamData(
                      unmangleString(row.TEAM_ID),
                      sportId,
                    );
                  }),
                ),
              ),
            ),
        ),
      );
    }
  }

  private async updateEventList(sportId: string) {
    let count = 0;
    for (let indent = -1; indent < 7; indent++) {
      const eventsAndTournaments = await this.getTransformed('events/list', {
        timezone: '0',
        indent_days: indent,
        sport_id: sportId,
        locale: 'en_GB',
      });

      await Promise.all(
        eventsAndTournaments.map(async (eventOrTournament) => {
          count++;
          if (eventOrTournament.type === 'event') {
            await this.updateData(Event, eventOrTournament);
            await this.updateEventData(eventOrTournament.external_id);
            await this.updateTeams(
              eventOrTournament.data.HOME_PARTICIPANT_IDS.concat(
                eventOrTournament.data.AWAY_PARTICIPANT_IDS,
              ).map(unmangleString),
              sportId,
            );
          }
        }),
      );
    }

    return count;
  }

  private async updateRankings(sportId: string) {
    const sportRankingsList = await this.updateDataList(
      SportRankings,
      this.getTransformed(
        'rankings/list',
        {
          sport_id: sportId,
          locale: 'en_GB',
        },
        sportId,
      ),
    );

    await Promise.all(
      sportRankingsList.map(
        async (list) =>
          await Promise.all(
            list.data.map(async (ranking) => {
              const rankingData = await this.updateDataList(
                Ranking,
                this.getTransformed(
                  'rankings/data',
                  {
                    ranking_id: unmangleString(ranking.RANKING_ID),
                    locale: 'en_GB',
                  },
                  unmangleString(ranking.RANKING_ID),
                ),
              );
            }),
          ),
      ),
    );
  }
}
