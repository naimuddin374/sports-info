import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from '../entities/Sport';
import { Repository } from 'typeorm';
import { flattenResponse } from '../utils';

@Controller('v1/sports')
@ApiTags('sports')
export class SportsController {
  constructor(@InjectRepository(Sport) private sportsRepo: Repository<Sport>) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all sports' })
  async getList() {
    return {
      data: (await this.sportsRepo.find()).map(flattenResponse),
    };
  }
}
