import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IRepositoryService,
  ORDER_REPOSITORY_SERVICE,
} from '../repository/repository.interface';
import { PatchOrderDTO, PostOrderDTO, TOrdersFilter } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY_SERVICE)
    private readonly repository: IRepositoryService,
  ) {}

  async postOrder(order: PostOrderDTO) {
    console.log(`OrderService::postOrder(order: ${JSON.stringify(order)})`);
    try {

      const orderResponse = await this.repository.postOrder(order);
      return orderResponse;

    } catch (error) {
      console.log(
        'OrderService::postOrder(order: PostOrderDTO) drop with error: ',
        error,
      );
      throw new BadRequestException({ message: error.message });
    }
  }

  async getOrders(userId: string, orderFilter: TOrdersFilter) {
    console.log(`OrderService::getOrders(
        userId: ${userId}},
        orderFilter: ${JSON.stringify(orderFilter)})`);
    try {
      if (orderFilter.pageSize === 0 || orderFilter.pageNumber < 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const orderResponse = await this.repository.getOrders(userId, orderFilter);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderService::getOrders(userId: string, orderFilter: TOrdersFilter) drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }

  async getOrder(id: string) {
    console.log(`OrderService::getOrder(
        id: ${id})`);
    try {
      if (id.length === 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const orderResponse = await this.repository.getOrder(id);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderService::getOrder(id: string) drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }

  async patchOrder(patchOrder: PatchOrderDTO) {
    console.log(`patchOrder(patchOrder: ${patchOrder}})`);
    try {
      if (patchOrder.id.length === 0 || patchOrder.status.length === 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }

      const orderResponse = await this.repository.patchOrderStatus(patchOrder.id, patchOrder.status);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderService::patchOrder(patchOrder: PatchOrderDTO) drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }
}