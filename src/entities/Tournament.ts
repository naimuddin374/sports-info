import { BaseEntity, Entity } from 'typeorm';
import { BaseDataEntity } from './BaseDataEntity';

@Entity()
export class Tournament extends BaseDataEntity {}
