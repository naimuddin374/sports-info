import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseDataEntity } from './BaseDataEntity';

@Entity()
export class TeamTransfer extends BaseDataEntity {}
