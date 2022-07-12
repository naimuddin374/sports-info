import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDataEntity } from './BaseDataEntity';

@Entity()
export class PlayerTransfer extends BaseDataEntity {
  @PrimaryGeneratedColumn()
  id: string;
}
