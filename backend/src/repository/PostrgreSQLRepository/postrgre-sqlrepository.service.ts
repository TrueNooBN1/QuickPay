import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IRepositoryService,
} from '../repository.interface';
import { PostOrderDTO, TOrdersFilter, TOrderStatus } from '../../order/dto/order.dto';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { OrderEntity } from 'src/order/entitys/order.entity';

@Injectable()
export class PostrgreSqlRepositoryService implements IRepositoryService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    // @InjectRepository(Schedule)
    // private scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  private getOrderMapperFn(): (Order) => PostOrderDTO {
    return (root) => {
      return {
        id: root.id,
        userId: root.userId,
        name: root.name,
        phone: root.phone,
        wallet: root.wallet,
        status: root.status,
        amount: root.amount,
        type: root.type,
        createdAt: root.createdAt,
      };
    };
  }

  async getOrders(userId: string, ordersFilter: TOrdersFilter) {
    console.log('PostrgreSqlrepositoryService::getOrders');

    // Защита от отрицательных или нулевых значений
    const page = Math.max(1, ordersFilter.pageNumber); // страница не может быть меньше 1
    const limit = Math.max(1, ordersFilter.pageSize);  // размер страницы минимум 1

    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { userId },
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    if (!orders) {
      return {
        total: 0,
        items: []
      };
    }

    const items = orders.map(order => this.getOrderMapperFn());

    return {
      total,
      items
    };
  }

async getOrder(id: string): Promise<PostOrderDTO | null> {
  console.log('PostrgreSqlrepositoryService::getOrder');

  const order = await this.orderRepository.findOne({
    where: { id },
  });

  if (!order) {
    return null; // или можно выбросить NotFoundException
  }

  // Получаем функцию-маппер и вызываем её с найденным заказом
  const mapper = this.getOrderMapperFn();
  return mapper(order);
}

async patchOrderStatus(id: string, status: TOrderStatus): Promise<PostOrderDTO | null> {
  const order = await this.orderRepository.findOne({ where: { id } });
  
  if (!order) {
    return null;
  }

  order.status = status;

  const updatedOrder = await this.orderRepository.save(order);

  const mapper = this.getOrderMapperFn();
  return mapper(updatedOrder);

}
  async postOrder(order: PostOrderDTO) {
    console.log(
      `PostrgreSqlrepositoryService::postOrder(order: ${JSON.stringify(order)})`,
    );
    // const queryRunner = this.dataSource.createQueryRunner();
    // //checkSession availability
    // queryRunner.connect();
    // queryRunner.startTransaction();
    // for (const ticket of order.tickets) {
    //   const session = await this.scheduleRepository.findOneBy({
    //     id: ticket.session,
    //   });
    //   if (!session) {
    //     console.log('noFilms');
    //     queryRunner.rollbackTransaction();
    //     throw new FilmOrSessionNotFoundException(ticket.film, ticket.session);
    //   }

    //   const takenArray = Array.isArray(session.taken) ? session.taken : [];

    //   if (takenArray.includes(generateTicketString(ticket.row, ticket.seat))) {
    //     console.log('noSeat');
    //     queryRunner.rollbackTransaction();
    //     throw new SeatAlreadyBookingException(ticket.seat, ticket.row);
    //   } else {
    //     takenArray.push(generateTicketString(ticket.row, ticket.seat));
    //     session.taken = takenArray;
    //     await this.scheduleRepository.save(session);
    //   }
    // }
    // queryRunner.commitTransaction();

    // const responseObject = {
    //   total: order.tickets.length,
    //   items: order.tickets.map((ticket) => ({
    //     ...ticket,
    //     id: randomUUID(),
    //   })),
    // };
    // return responseObject;
  }
}
