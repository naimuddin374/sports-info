import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API version' })
  @ApiTags('api info')
  getVersion(): object {
    return this.appService.getVersion();
  }
}
