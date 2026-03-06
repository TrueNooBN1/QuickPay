import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getFilms: jest.fn().mockResolvedValue(fixtures.films),
        getFilmSchedule: jest.fn().mockResolvedValue(fixtures.film.schedule),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return films', async () => {
    const findResult = await controller.getAllFilms();
    expect(findResult).toEqual(fixtures.films);
  });

  it('should return film schedule', async () => {
    const findResult = await controller.getFilmSchedule(
      '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    );
    expect(findResult).toEqual(fixtures.film.schedule);
  });
});
