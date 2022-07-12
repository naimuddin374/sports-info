import { BaseTransformer } from './BaseTransformer';

export class TeamTransferTransformer extends BaseTransformer {
  MANGLE_ID_FIELDS: string[] = ['PLAYER.PARTICIPANT_ID'];
  ENTITY_PATH = 'DATA';
  COLLECT = true;
}
