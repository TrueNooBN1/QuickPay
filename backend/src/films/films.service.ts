import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IRepositoryService,
  FILM_REPOSITORY_SERVICE,
} from '../repository/repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILM_REPOSITORY_SERVICE)
    private readonly repository: IRepositoryService,
  ) {}

  async getFilms() {
    console.log('FilmsService::getFilms');
    const films = this.repository.getFilms();
    if (!films) throw new BadRequestException({ message: `Films not found` });
    return films;
  }

  async getFilmSchedule(id: string) {
    console.log('FilmsService::getFilmSchedule(id: string),', id);
    const schedule = await this.repository.getFilmSchedule(id);
    if (!schedule) {
      throw new NotFoundException({
        message: `Film with id ${id} not found`,
      });
    }

    return schedule;
  }
}
