import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IRepositoryService,
  FILM_REPOSITORY_SERVICE,
} from '../repository/repository.interface';
import { PostOrderDTO } from './dto/order.dto';
import {
  TicketsNotFoundInOrderException,
  FilmOrSessionNotFoundException,
  SeatAlreadyBookingException,
} from '../exceptions/order.exceptions';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILM_REPOSITORY_SERVICE)
    private readonly repository: IRepositoryService,
  ) {}

  async postOrder(order: PostOrderDTO) {
    console.log(`OrderService::postOrder(order: ${JSON.stringify(order)})`);
    try {
      if (!order.tickets || order.tickets.length === 0) {
        throw new TicketsNotFoundInOrderException();
      }
      const orderResponse = await this.repository.postOrder(order);
      return orderResponse;
    } catch (error) {
      console.log(
        'OrderService::postOrder(order: PostOrderDTO) drop with error: ',
        error,
      );
      if (error instanceof TicketsNotFoundInOrderException) {
        throw new BadRequestException({ message: error.message });
      }
      if (error instanceof FilmOrSessionNotFoundException) {
        throw new NotFoundException({ message: error.message });
      }
      if (error instanceof SeatAlreadyBookingException) {
        throw new ConflictException({ message: error.message });
      }
    }
  }
}
