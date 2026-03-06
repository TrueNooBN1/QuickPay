import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { PostOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  postOrder(@Body() body: PostOrderDTO) {
    console.log(
      `OrderController::postOrder(@Body() body: ${JSON.stringify(body)})`,
    );
    return this.orderService.postOrder(body);
  }
}
