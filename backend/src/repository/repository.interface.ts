import { PostOrderDTO } from 'src/order/dto/order.dto';

export const FILM_REPOSITORY_SERVICE = 'FILM_REPOSITORY_SERVICE';

export function generateTicketString(row: number, seat: number): string {
  return `${row}:${seat}`;
}

export interface IRepositoryService {
  getFilms();
  getFilmSchedule(id: string);
  postOrder(order: PostOrderDTO);
}
