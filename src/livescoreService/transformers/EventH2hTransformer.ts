import { BaseTransformer } from './BaseTransformer';

export class EventH2hTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
