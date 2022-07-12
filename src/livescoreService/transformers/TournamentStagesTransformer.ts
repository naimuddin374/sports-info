import { BaseTransformer } from './BaseTransformer';

export class TournamentStagesTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [
    'SEASON_ID',
    'SEASON_TOURNAMENT_STAGE_ID',
    'STAGE_ID',
  ];
  ID_PATH = 'STAGE_ID';
  ENTITY_PATH = 'DATA';
}
