import { BaseTransformer } from './BaseTransformer';

export class RankingTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = [];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
