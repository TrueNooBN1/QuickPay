import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PostOrderDTO } from './dto/order.dto';
import { orderMockResult, postOrderMock } from './order.fixtures';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        postOrder: jest.fn().mockResolvedValue(orderMockResult),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return order result', async () => {
    const orderData: PostOrderDTO = postOrderMock;

    const orderResult = await controller.postOrder(orderData);

    const result = {
      items: orderData.tickets,
      total: orderData.tickets.length,
    };

    expect(orderResult).toEqual(result);
  });
});
