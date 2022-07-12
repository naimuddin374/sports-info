import { BaseTransformer } from './BaseTransformer';

export class SportTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ID_PATH = 'SPORT_ID';
  ENTITY_PATH = 'DATA.SPORTS';
  MANGLE_ID = false;
}
