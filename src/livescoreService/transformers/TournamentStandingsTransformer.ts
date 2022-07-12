import { BaseTransformer } from './BaseTransformer';

export class TournamentStandingsTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['ROWS.TEAM_ID'];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
