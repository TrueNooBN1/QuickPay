import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PatchOrderDTO, PostOrderDTO, TOrdersFilter} from './dto/order.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { UserRole } from 'src/tg_user/dto/get-user.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async postOrder(
    @Body() body: PostOrderDTO,
    @User() user
  ) {
    console.log(
      `OrderController::postOrder(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    );
    
    try {

      const orderResponse = await this.orderService.postOrder(body);
      return orderResponse;

    } catch (error) {
      console.log(
        'OrderController::postOrder(@Body() body,s @User() user) drop with error: ',
        error,
      );
      throw new BadRequestException({ message: error.message });
    }
  }

  @Patch("filtered")
  @UseGuards(JwtAuthGuard)
  async getOrders(
    @Body() body: TOrdersFilter,
    @User() user
  ) {
    console.log(
      `OrderController::getOrder(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    );
    try {
      if (body.pageSize === 0 || body.pageNumber < 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const isAdmin = user.roles.indexOf(UserRole.ADMIN) !== - 1;
      const orderResponse = await this.orderService.getOrders(body.fromUser && isAdmin ? body.fromUser:user.userId, body);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderController::getOrder(@Body() body: TOrdersFilter, @User() user drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }

  
  @Get('rates')
  async getRates(){
    console.log("OrderController::getRates()")
    return await this.orderService.getRates();
  } 



  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Param() id: string,
  ) {
    console.log(
      `OrderController::getOrder(@Body() id: ${id})`,
    );
    try {
      if (id.length === 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const orderResponse = await this.orderService.getOrder(id);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderController::getOrder(@Body() id: string) drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }


  @Patch()
  @UseGuards(JwtAuthGuard)
  async patchOrderStatus(
    @Body() body: PatchOrderDTO,
    @User() user
  ){
    console.log(
      `OrderController::patchOrderStatus(@Body() body: PatchOrderDTO, @User() user): ${JSON.stringify(body)} @User() ${user})`,
    );
    try {
      if (body.id.length === 0 || body.status.length === 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }

      const orderResponse = await this.orderService.patchOrderStatus(body.id, body.status);

      return orderResponse;
    } catch (error) {
      console.log(
        'OrderController::patchOrderStatus(@Body() body: PatchOrderDTO, @User() user) drop with error: ',
        error,
      );      
      throw new BadRequestException({ message: error.message });
    }
  }


  
}
