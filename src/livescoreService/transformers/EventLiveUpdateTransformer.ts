import { BaseTransformer } from './BaseTransformer';

export class EventLiveUpdateTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ID_PATH = 'EVENT_ID';
  ENTITY_PATH = 'DATA';
}
