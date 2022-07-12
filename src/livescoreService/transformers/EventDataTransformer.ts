import { BaseTransformer, TransformResult } from './BaseTransformer';
import { get } from 'lodash';

export class EventDataTransformer extends BaseTransformer {
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
    const entity = get(data, 'DATA', []);
    const sportId = get(entity, 'SPORT.SPORT_ID', null);
    const tournamentId = get(entity, 'TOURNAMENT.TOURNAMENT_ID', null);
    const tournament = this.mapIds(get(entity, 'TOURNAMENT', {}));
    tournament['SPORT_ID'] = sportId;
    result.push({
      data: tournament,
      external_id: tournamentId,
      id: this.mangleId(tournamentId),
      type: 'tournament',
    });

    const event = get(entity, 'EVENT', {});
    const id = event.EVENT_ID;
    event['SPORT_ID'] = sportId;
    event['TOURNAMENT_ID'] = tournamentId;
    result.push({
      data: this.mapIds(event),
      external_id: event.EVENT_ID,
      id: this.mangleId(id),
      type: 'event',
    });

    return result;
  }
}
