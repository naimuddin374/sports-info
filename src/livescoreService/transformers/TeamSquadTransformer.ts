import { BaseTransformer } from './BaseTransformer';

export class TeamSquadTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['ITEMS.PLAYER_ID'];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
