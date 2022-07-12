import { BaseTransformer } from './BaseTransformer';

export class TeamDataTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ID_PATH = 'ID';
  ENTITY_PATH = 'DATA';
  SINGLE = true;
}
