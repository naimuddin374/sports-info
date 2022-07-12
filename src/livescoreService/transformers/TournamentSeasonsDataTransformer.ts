import { BaseTransformer } from './BaseTransformer';

export class TournamentSeasonsDataTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['TOURNAMENT_ID', 'TOURNAMENT_STAGE_ID'];
  ID_PATH = 'TOURNAMENT_STAGE_ID';
  ENTITY_PATH = 'DATA';
}
