import { BaseTransformer } from './BaseTransformer';

export class EventNewsTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['ID'];
  ID_PATH = 'ID';
  ENTITY_PATH = 'DATA';
}
