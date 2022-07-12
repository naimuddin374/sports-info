import { BaseTransformer } from './BaseTransformer';

export class EventSummaryTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
