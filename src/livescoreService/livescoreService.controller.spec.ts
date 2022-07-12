import { Test, TestingModule } from '@nestjs/testing';
import { LivescoreServiceController } from './livescoreService.controller';
import { LiveScoreServiceService } from './livescoreService.service';
import { Connection } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { readFileSync } from 'fs';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { TransformerFactory } from './transformers/TransformerFactory';
import { RateLock } from '../entities/RateLock';
import { HttpException } from '@nestjs/common';

describe('LivescoreController', () => {
  let livescoreController: LivescoreServiceController;
  let httpService: HttpService;
  let connection: Connection;
  let CRON_KEY: string;

  beforeEach(async () => {
    CRON_KEY = 'abckey';
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LivescoreServiceController],
      providers: [
        TransformerFactory,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CRON_KEY') {
                return CRON_KEY;
              }

              return null;
            }),
          },
        },
        {
          provide: RateLock,
          useFactory: jest.fn(() => ({
            acquireLock: jest.fn(() => true),
          })),
        },
        {
          provide: HttpService,
          useFactory: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
        {
          provide: Connection,
          useFactory: jest.fn(() => ({
            manager: {
              findOne: jest.fn(() => {
                return Promise.resolve({
                  data: {
                    test: 'test',
                  },
                  save: jest.fn(),
                });
              }),
            },
          })),
        },
        LiveScoreServiceService,
      ],
    }).compile();

    httpService = app.get<HttpService>(HttpService);
    connection = app.get<Connection>(Connection);
    livescoreController = app.get<LivescoreServiceController>(
      LivescoreServiceController,
    );
  });

  describe('loadSports', () => {
    it('should process sports data', async () => {
      const data = JSON.parse(
        readFileSync('testdata/sports-events-count.json').toString(),
      );

      const httpSpy = jest.spyOn(httpService, 'get').mockImplementation(
        () =>
          new Observable((subscriber) => {
            subscriber.next({
              data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            });
          }),
      );

      expect((await livescoreController.loadSports('abckey')).sportsCount).toBe(
        data.DATA.SPORTS.length,
      );
      expect(httpSpy).toHaveBeenCalled();
      expect(connection.manager.findOne).toHaveBeenCalledTimes(
        data.DATA.SPORTS.length,
      );
    });
    it('should fail on invalid key', async () => {
      await expect(livescoreController.loadSports('abc')).rejects.toThrowError(
        HttpException,
      );
    });
    it('should fail on missing key', async () => {
      await expect(livescoreController.loadSports(null)).rejects.toThrowError(
        HttpException,
      );
    });
    it('should fail on unconfigured key', async () => {
      CRON_KEY = '';
      await expect(livescoreController.loadSports('')).rejects.toThrowError(
        HttpException,
      );
    });
  });
});
