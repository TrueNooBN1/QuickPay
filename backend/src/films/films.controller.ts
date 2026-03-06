import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getAllFilms() {
    console.log('FilmsController::getAllFilms()');
    return this.filmsService.getFilms();
  }

  @Get('/:id/schedule/')
  getFilmSchedule(@Param('id') filmId: string) {
    console.log(`FilmsController::getFilmSchedule(@Param() filmId: ${filmId})`);
    return this.filmsService.getFilmSchedule(filmId);
  }
}
