import { Test, TestingModule } from '@nestjs/testing';
import { SportsController } from './sports.controller';
import { Sport } from '../entities/Sport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { transformedTestDataFor } from '../../test/utils';

describe('SportsController', () => {
  let sportsController: SportsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [
        {
          provide: getRepositoryToken(Sport),
          useValue: {
            find: () => {
              return transformedTestDataFor('sports/events-count');
            },
          },
        },
      ],
    }).compile();

    sportsController = app.get<SportsController>(SportsController);
  });
  describe('getList', () => {
    it('should return a list of sports', async () => {
      const response = await sportsController.getList();
      expect(response.data.length).toBe(34);
      expect(response.data[1].SPORT_NAME).toBe('TENNIS');
    });
  });
});
