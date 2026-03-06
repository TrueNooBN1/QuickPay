import { Injectable } from '@nestjs/common';
import {
  generateTicketString,
  IRepositoryService,
} from '../repository.interface';
import { GetFilmDTO } from '../../films/dto/films.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from '../../films/schemas/films.schema';
import { Model } from 'mongoose';
import { PostOrderDTO } from '../../order/dto/order.dto';
import { randomUUID } from 'crypto';
import {
  TicketsNotFoundInOrderException,
  FilmOrSessionNotFoundException,
  SeatAlreadyBookingException,
} from '../../exceptions/order.exceptions';

@Injectable()
export class MongoRepositoryService implements IRepositoryService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

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
    console.log('RepositoryService::getFilms');
    const filmsCount = await this.filmModel.countDocuments({});
    const films = await this.filmModel.find({});
    if (!films) return null;

    const dbFilms = films.map(this.getFilmMapperFn());

    const mappedFilm = dbFilms.map((film) => {
      const { schedule: _schedule, ...filmInfo } = film;
      return filmInfo;
    });

    return {
      total: filmsCount,
      items: mappedFilm,
    };
  }

  async getFilmSchedule(id: string) {
    console.log('RepositoryService::getFilmSchedule(id: string),', id);
    const dbFilm = await this.filmModel.findOne({ id: id });
    if (!dbFilm) return null;

    const { schedule } = this.getFilmMapperFn()(dbFilm);
    return {
      total: schedule.length,
      items: schedule,
    };
  }

  async postOrder(order: PostOrderDTO) {
    console.log(
      `RepositoryService::postOrder(order: ${JSON.stringify(order)})`,
    );
    if (order.tickets.length === 0) {
      throw new TicketsNotFoundInOrderException();
    }

    for (const ticket of order.tickets) {
      const film = await this.filmModel.findOne({
        id: ticket.film,
        schedule: {
          $elemMatch: { id: ticket.session },
        },
      });
      if (!film) {
        console.log('noFilms');
        throw new FilmOrSessionNotFoundException(ticket.film, ticket.session);
      }
      const session = film.schedule.find(
        (session) => session.id === ticket.session,
      );
      if (
        session.taken.includes(generateTicketString(ticket.row, ticket.seat))
      ) {
        console.log('noSeat');
        throw new SeatAlreadyBookingException(ticket.seat, ticket.row);
      }
    }

    for (const ticket of order.tickets) {
      await this.filmModel.updateOne(
        {
          id: ticket.film,
          schedule: { $elemMatch: { id: ticket.session } },
        },
        {
          $push: {
            'schedule.$.taken': generateTicketString(ticket.row, ticket.seat),
          },
        },
        {
          new: true,
        },
      );
    }

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
