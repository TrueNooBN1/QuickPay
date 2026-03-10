import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PatchOrderDTO, PostOrderDTO, TOrdersFilter, TOrderStatus } from './dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entitys/order.entity';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private dataSource: DataSource,
  ) {}


  private prevRateIn: number | null = null;
  private prevRateOut: number | null = null;
  private prevRateUpdateTime: Date | null = null;



  private getOrderMapperFn(): (Order) => PostOrderDTO {
    return (root) => {
      return {
        id: root.id,
        userId: root.userId,
        name: root.name,
        phone: root.phone,
        wallet: root.wallet,
        status: root.status,
        totalSum: root.totalSum,
        exchangeRate: root.exchangeRate,  
        exchangeValue: root.exchangeValue,
        type: root.type,
        createdAt: root.createdAt,
      };
    };
  }

  async postOrder(order: PostOrderDTO) {
    console.log(`OrderService::postOrder(order: ${JSON.stringify(order)})`);
    const queryRunner = this.dataSource.createQueryRunner();
    //checkSession availability
    queryRunner.connect();
    queryRunner.startTransaction();

    if(order.exchangeValue===undefined ||
       order.exchangeRate===undefined || 
       order.totalSum===undefined || 
       order.name.length===0 || 
       order.phone.length===0 || 
       order.userId.length===0 || 
       order.type.length===0 || 
       order.wallet.length===0)
      throw new BadRequestException("Некорректные данные для офромления заявки");

    const newOrder = await this.orderRepository.save({
      totalSum: order.totalSum,
      exchangeValue: order.exchangeValue,
      exchangeRate: order.exchangeRate,
      name: order.name,
      phone: order.phone,
      userId: order.userId,
      type: order.type,
      wallet: order.wallet,
      status: TOrderStatus.CREATED,
      createdAt: new Date(),
    });

    queryRunner.commitTransaction();
    console.log(`OrderService::postOrder after commit (order: ${JSON.stringify(newOrder)})`);

    const mapper = this.getOrderMapperFn();
    return mapper(newOrder);

  }

  async getOrders(userId: string, ordersFilter: TOrdersFilter) {
    console.log(`OrderService::getOrders(
        userId: ${userId}},
        orderFilter: ${JSON.stringify(ordersFilter)})`);
    // Защита от отрицательных или нулевых значений
    const page = Math.max(1, ordersFilter.pageNumber); // страница не может быть меньше 1
    const limit = Math.max(1, ordersFilter.pageSize);  // размер страницы минимум 1

    const skip = (page - 1) * limit;
    const where: {
        userId: string;
        status?: TOrderStatus;
      } = { userId};

    if (ordersFilter.status && ordersFilter.status.length !== 0) {
      where.status = ordersFilter.status[0]; // используем переданный статус
    }
    const [orders, total] = await this.orderRepository.findAndCount({
      where: where,
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    if (!orders) {
      return {
        total: 0,
        orders: []
      };
    }

    const items = orders.map(order => this.getOrderMapperFn()(order));


    return {
      total,
      orders: items
    };
  }

  async getOrder(id: string) {
    console.log(`OrderService::getOrder(
        id: ${id})`);

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
    console.log(`OrderService::patchOrderStatus(id: ${id}, status: ${status}})`);

    const order = await this.orderRepository.findOne({ where: { id } });
    
    if (!order) {
      return null;
    }

    order.status = status;

    const updatedOrder = await this.orderRepository.save(order);

    const mapper = this.getOrderMapperFn();
    return mapper(updatedOrder);

  }
  setRate(rateIn:number, rateOut:number){
    this.prevRateUpdateTime = new Date();
    this.prevRateIn = rateIn;
    this.prevRateOut = 1/rateOut;
    // console.log(`this.prevRateIn ${this.prevRateIn}`)
    // console.log(`this.prevRateOut ${this.prevRateOut}`)
  }

  async getRates(){

    return {
      rates:{
        rateIn: Math.floor(this.prevRateIn * 1.02*100)/100,
        rateOut: Math.ceil(this.prevRateOut * 0.98*100)/100
      }
    }
  }
  
}