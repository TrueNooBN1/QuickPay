import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { PostrgreSqlRepositoryService } from './../../src/repository/PostrgreSQLRepository/postrgre-sqlrepository.service';
import { FILM_REPOSITORY_SERVICE } from './../../src/repository/repository.interface';
import { fixtures } from './films.fixtures';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmRepository: PostrgreSqlRepositoryService;

  beforeEach(async () => {
    filmRepository = {
      getFilms: jest.fn().mockResolvedValue({
        items: fixtures.films,
        total: fixtures.films.length,
      }),
      getFilmSchedule: jest.fn().mockResolvedValue({
        items: fixtures.film.schedule,
        total: fixtures.film.schedule.length,
      }),
    } as unknown as PostrgreSqlRepositoryService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FILM_REPOSITORY_SERVICE,
          useValue: filmRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all films', async () => {
    expect(service).toBeDefined();
    const findedResult = await filmRepository.getFilms();
    expect(findedResult).toEqual({
      items: fixtures.films,
      total: fixtures.films.length,
    });
  });

  it('should return film schedule by id', async () => {
    expect(service).toBeDefined();
    const findedResult = await filmRepository.getFilmSchedule(
      '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    );
    expect(findedResult).toEqual({
      items: fixtures.film.schedule,
      total: fixtures.film.schedule.length,
    });
  });
});
