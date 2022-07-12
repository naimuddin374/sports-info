import { Module } from '@nestjs/common';
import { SportsController } from './sports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from '../entities/Sport';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportsController],
})
export class SportsModule {}
