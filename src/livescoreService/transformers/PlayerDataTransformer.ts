import { BaseTransformer } from './BaseTransformer';

export class PlayerDataTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['ID', 'TEAM_ID'];
  ID_PATH = 'ID';
  ENTITY_PATH = 'DATA';
  SINGLE = true;
}
