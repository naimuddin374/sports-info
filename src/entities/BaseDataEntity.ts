import { BaseEntity, Column, Index, PrimaryColumn } from 'typeorm';

export abstract class BaseDataEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @Index()
  external_id: string;

  @Column({
    type: 'jsonb',
  })
  public data: any;
}
