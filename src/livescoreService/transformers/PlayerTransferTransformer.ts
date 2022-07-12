import { BaseTransformer } from './BaseTransformer';

export class PlayerTransferTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['FROM_TEAM_ID', 'TO_TEAM_ID'];
  ENTITY_PATH = 'DATA';
}
