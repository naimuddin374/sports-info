import { BaseTransformer } from './BaseTransformer';

export class TeamNewsTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ID_PATH = 'ID';
  ENTITY_PATH = 'DATA';
}
