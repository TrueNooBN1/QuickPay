import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateTicketString,
  IRepositoryService,
} from '../repository.interface';
import { PostOrderDTO } from '../../order/dto/order.dto';
import {
  FilmOrSessionNotFoundException,
  SeatAlreadyBookingException,
} from '../../exceptions/order.exceptions';
import { DataSource, Repository } from 'typeorm';
import { FilmEntity } from '../../films/entitys/film.entity';
import { Schedule } from '../../films/entitys/schedule.entity';
import { GetFilmDTO } from 'src/films/dto/films.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PostrgreSqlRepositoryService implements IRepositoryService {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  private getFilmMapperFn(): (Film) => GetFilmDTO {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
        schedule: root.schedule,
      };
    };
  }

  async getFilms() {
    console.log('PostrgreSqlrepositoryService::getFilms');
    const [films, total] = await this.filmRepository.findAndCount({});
    if (!films) return null;

    const dbFilms = films.map(this.getFilmMapperFn());
    return {
      total: total,
      items: dbFilms,
    };
  }

  async getFilmSchedule(id: string) {
    console.log(
      'PostrgreSqlrepositoryService::getFilmSchedule(id: string),',
      id,
    );
    const [schedules, total] = await this.scheduleRepository.findAndCount({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });
    if (!schedules) return null;

    return {
      total: total,
      items: schedules,
    };
  }

  async postOrder(order: PostOrderDTO) {
    console.log(
      `PostrgreSqlrepositoryService::postOrder(order: ${JSON.stringify(order)})`,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    //checkSession availability
    queryRunner.connect();
    queryRunner.startTransaction();
    for (const ticket of order.tickets) {
      const session = await this.scheduleRepository.findOneBy({
        id: ticket.session,
      });
      if (!session) {
        console.log('noFilms');
        queryRunner.rollbackTransaction();
        throw new FilmOrSessionNotFoundException(ticket.film, ticket.session);
      }

      const takenArray = Array.isArray(session.taken) ? session.taken : [];

      if (takenArray.includes(generateTicketString(ticket.row, ticket.seat))) {
        console.log('noSeat');
        queryRunner.rollbackTransaction();
        throw new SeatAlreadyBookingException(ticket.seat, ticket.row);
      } else {
        takenArray.push(generateTicketString(ticket.row, ticket.seat));
        session.taken = takenArray;
        await this.scheduleRepository.save(session);
      }
    }
    queryRunner.commitTransaction();

    const responseObject = {
      total: order.tickets.length,
      items: order.tickets.map((ticket) => ({
        ...ticket,
        id: randomUUID(),
      })),
    };
    return responseObject;
  }
}
