import {
  BaseEntity,
  Column,
  Entity,
  EntityManager,
  PrimaryGeneratedColumn,
  Transaction,
  TransactionManager,
} from 'typeorm';

const MAX_ATTEMPTS = 100;

@Entity()
export class RateLock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
  })
  locktime: Date;

  @Column()
  key: string;

  @Column()
  lockcount: number;

  async acquireLock(
    key: string,
    delayMs: number,
    overrideMs: number,
    @TransactionManager() manager: EntityManager,
  ) {
    let attempts = 0;
    while (attempts++ < MAX_ATTEMPTS) {
      const result = await this._acquireLock(key, delayMs, overrideMs, manager);
      if (result !== false) {
        return result;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, attempts < MAX_ATTEMPTS / 2 ? 100 : 2000);
      });
    }
    return false;
  }

  @Transaction()
  private async _acquireLock(
    key: string,
    delayMs: number,
    overrideMs: number,
    @TransactionManager() manager: EntityManager,
  ) {
    const data = await manager.query(
      'SELECT lockcount, EXTRACT(EPOCH FROM now() - locktime) * 1000 as lockage FROM rate_lock WHERE key=$1 FOR UPDATE',
      [key],
    );

    if (data.length === 0) {
      await manager.query(
        'INSERT INTO rate_lock(key, locktime, lockcount) VALUES($1, now(), 1)',
        [key],
      );
    } else {
      const { lockcount, lockage } = data[0];

      if (lockage < delayMs || (lockcount >= 1 && lockage < overrideMs)) {
        return false;
      }

      await manager.query(
        'UPDATE rate_lock SET lockcount=1, locktime=now() WHERE key=$1',
        [key],
      );
    }

    const time = await manager.query(
      'SELECT EXTRACT(EPOCH FROM locktime) as locktime FROM rate_lock WHERE key=$1',
      [key],
    );
    return time[0].locktime;
  }

  @Transaction()
  async releaseLock(
    key: string,
    lock: string,
    @TransactionManager() manager: EntityManager,
  ) {
    console.log('unlock');
    await manager.query('UPDATE rate_lock SET lockcount=0 WHERE key=$1', [key]);
  }
}
