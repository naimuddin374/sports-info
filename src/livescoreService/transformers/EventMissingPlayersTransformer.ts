import { BaseTransformer } from './BaseTransformer';

export class EventMissingPlayersTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
