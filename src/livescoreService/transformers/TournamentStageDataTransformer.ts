import { BaseTransformer } from './BaseTransformer';

export class TournamentStageDataTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [
    'SPORT_ID',
    'STAGE_ID',
    'SEASON_ID',
    'SEASON_TOURNAMENT_STAGE_ID',
  ];
  ID_PATH = 'SEASON_ID';
  ENTITY_PATH = 'DATA.SEASONS';
}
