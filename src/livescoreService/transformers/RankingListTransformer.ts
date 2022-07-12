import { BaseTransformer } from './BaseTransformer';

export class RankingListTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['RANKING_ID'];
  MANGLE_ID = false;
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
