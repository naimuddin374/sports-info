import {
  Controller,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  Query,
} from '@nestjs/common';
import { LiveScoreServiceService } from './livescoreService.service';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('v1/cron')
export class LivescoreServiceController {
  constructor(
    readonly liveScore: LiveScoreServiceService,
    readonly configService: ConfigService,
  ) {}

  private checkAuth(authKey: string) {
    const key = this.configService.get('CRON_KEY');
    if (!key || authKey !== key) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post('sports')
  @ApiExcludeEndpoint()
  async loadSports(@Headers('Authorization') authKey: string) {
    this.checkAuth(authKey);

    return await this.liveScore.loadSports();
  }

  @Post('history')
  @ApiExcludeEndpoint()
  async loadHistoricalData(
    @Headers('Authorization') authKey: string,
    @Query('sport_id') sportId: string,
  ) {
    this.checkAuth(authKey);

    return await this.liveScore.loadHistoricalData(sportId);
  }

  @Post('current')
  @ApiExcludeEndpoint()
  async updateCurrentData(
    @Headers('Authorization') authKey: string,
    @Query('sport_id') sportId: string,
  ) {
    this.checkAuth(authKey);

    return await this.liveScore.updateCurrentData(sportId);
  }

  @Post('live')
  @ApiExcludeEndpoint()
  async updateLiveData(
    @Headers('Authorization') authKey: string,
    @Query('sport_id') sportId: string,
    @Query('duration') duration: number,
  ) {
    this.checkAuth(authKey);

    return await this.liveScore.updateLiveData(sportId);
  }
}
