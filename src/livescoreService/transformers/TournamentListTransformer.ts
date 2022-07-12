import { BaseTransformer } from './BaseTransformer';

export class TournamentListTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [
    'ACTUAL_TOURNAMENT_SEASON_ID',
    'STAGES.STAGE_ID',
  ];
  ID_PATH = 'TE';
  ENTITY_PATH = 'DATA';
}
