import { BaseTransformer } from './BaseTransformer';

export class EventScorecardTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
