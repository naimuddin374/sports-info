import { BaseTransformer, TransformResult } from './BaseTransformer';
import { get } from 'lodash';

export class EventListTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [
    'EVENT_ID',
    'TOURNAMENT_ID',
    'HOME_PARTICIPANT_IDS',
    'AWAY_PARTICIPANT_IDS',
    'AWAY_EVENT_PARTICIPANT_IDS',
    'HOME_EVENT_PARTICIPANT_ID',
    'TOURNAMENT_STAGE_ID',
    'TOURNAMENT_SEASON_ID',
  ];

  processData(data: any): TransformResult[] {
    const result = [];

    const tournaments = get(data, 'DATA', []);
    tournaments.forEach((entity) => {
      const { EVENTS, ...tournamentData } = entity;

      EVENTS.forEach((entity) => {
        const id = entity.EVENT_ID;
        const event = this.mapIds({ ...tournamentData, ...entity });
        result.push({
          data: event,
          external_id: id,
          id: this.mangleId(id),
          type: 'event',
        });
      });
    });

    return result;
  }
}
