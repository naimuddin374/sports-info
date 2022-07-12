import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDataEntity } from './BaseDataEntity';

@Entity()
export class PlayerLastEvents extends BaseDataEntity {}
