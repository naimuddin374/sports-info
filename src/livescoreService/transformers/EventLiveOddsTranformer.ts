import { BaseTransformer } from './BaseTransformer';

export class EventLiveOddsTranformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  SINGLE = true;
}
