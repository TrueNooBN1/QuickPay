import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PatchOrderDTO, PostOrderDTO, TOrdersFilter} from './dto/order.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  postOrder(
    @Body() body: PostOrderDTO,
    @User() user
  ) {
    console.log(
      `OrderController::postOrder(@Body() body: ${JSON.stringify(body)})`,
    );
    return this.orderService.postOrder(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(
    @Body() body: TOrdersFilter,
    @User() user
  ) {
    console.log(
      `OrderController::postOrder(@Body() body: ${JSON.stringify(body)})`,
    );
    return this.orderService.getOrders(user.userId, body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrder(
    @Param() id: string,
  ) {
    console.log(
      `OrderController::getOrder(@Body() id: ${id})`,
    );
    return this.orderService.getOrder(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  patchOrderStatus(
    @Body() body: PatchOrderDTO,
    @User() user
  ){
    console.log(
      `OrderController::patchOrderStatus(@Body() body: ${JSON.stringify(body)})`,
    );
    return this.orderService.patchOrder(body);
  }
}
