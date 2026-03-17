import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { PatchOrderDTO, PostOrderDTO, TOrdersFilter} from './dto/order.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { UserRole } from 'src/tg_user/dto/get-user.dto';
import { AdminDataDTO } from 'src/admin-data/dto/admin-data.dto';
import { AdminDataService } from 'src/admin-data/admin-data.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly adminDataService: AdminDataService
  ) {}

  @Get("admin-data")
  @UseGuards(JwtAuthGuard)
  async getAdminData(
    @User() user
  ) {
    // console.log(
    //   `OrderController::getAdminData(@User() ${user})`,
    // );
    try {
      const isAdmin = user.roles.indexOf(UserRole.ADMIN) !== - 1;

      if(!isAdmin){
        throw new UnauthorizedException();
      }
      const newAdminDataResponse = await this.adminDataService.getAdminData();
      return {data:newAdminDataResponse};
    } catch (error) {
      // console.log(
      //   'OrderController::getAdminData(@User() user drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }

  @Patch("admin-data")
  @UseGuards(JwtAuthGuard)
  async patchAdminData(
    @Body() body: AdminDataDTO,
    @User() user
  ) {
    // console.log(
    //   `OrderController::patchAdminData(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    // );
    try {
      const isAdmin = user.roles.indexOf(UserRole.ADMIN) !== - 1;
      if(!isAdmin){
        throw new UnauthorizedException();
      }
      // console.log("OrderController::patchAdminData->to service")
      const newAdminDataResponse = await this.adminDataService.patchAdminData(body);
      return {data: newAdminDataResponse};
    } catch (error) {
      // console.log(
      //   'OrderController::patchAdminData(@Body() body: AdminDataDTO, @User() user drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }   

  @Post()
  @UseGuards(JwtAuthGuard)
  async postOrder(
    @Body() body: PostOrderDTO,
    @User() user
  ) {
    // console.log(
    //   `OrderController::postOrder(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    // );
    
    try {

      const orderResponse = await this.orderService.postOrder(body);
      return orderResponse;

    } catch (error) {
      // console.log(
      //   'OrderController::postOrder(@Body() body,s @User() user) drop with error: ',
      //   error,
      // );
      throw new BadRequestException({ message: error.message });
    }
  }

  @Patch("filtered")
  @UseGuards(JwtAuthGuard)
  async getOrders(
    @Body() body: TOrdersFilter,
    @User() user
  ) {
    // console.log(
    //   `OrderController::getOrder(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    // );
    try {
      if (body.pageSize === 0 || body.pageNumber < 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }

      const orderResponse = await this.orderService.getOrders(user.userId, body);
      return orderResponse;

    } catch (error) {
      // console.log(
      //   'OrderController::getOrder(@Body() body: TOrdersFilter, @User() user drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }

  @Patch("admin")
  @UseGuards(JwtAuthGuard)
  async getAllOrders(
    @Body() body: TOrdersFilter,
    @User() user
  ) {
    // console.log(
    //   `OrderController::getAllOrders(@Body() body: ${JSON.stringify(body)} @User() ${user})`,
    // );
    try {
      if (body.pageSize === 0 || body.pageNumber < 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const isAdmin = user.roles.indexOf(UserRole.ADMIN) !== - 1;

      if(!isAdmin){
        throw new UnauthorizedException();
      }
      const orderResponse = await this.orderService.getOrders(null, body);
      return orderResponse;
    } catch (error) {
      // console.log(
      //   'OrderController::getAllOrders(@Body() body: TOrdersFilter, @User() user drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }

  
  @Get('rates')
  async getRates(){
    // console.log("OrderController::getRates()")
    return await this.adminDataService.getRates();
  } 

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Param() id: string,
  ) {
    // console.log(
    //   `OrderController::getOrder(@Body() id: ${id})`,
    // );
    try {
      if (id.length === 0) {
        throw new BadRequestException("Не заданы параметры фильтра");
      }
      const orderResponse = await this.orderService.getOrder(id);

      return orderResponse;
    } catch (error) {
      // console.log(
      //   'OrderController::getOrder(@Body() id: string) drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }


  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async patchOrderStatus(
    @Body() body: PatchOrderDTO,
    @Param('id') id: string,
    @User() user
  ){
    // console.log(
    //   `OrderController::patchOrderStatus(@Body() body: PatchOrderDTO, @User() user): ${JSON.stringify(body)} @User() ${user})`,
    // );
    try {
      if (id.length === 0 || body.status.length === 0) {
        throw new BadRequestException("Некорректный запрос");
      }

      const orderResponse = await this.orderService.patchOrderStatus(id, body.status, body.executionRate);

      return {orders:[orderResponse]};
    } catch (error) {
      // console.log(
      //   'OrderController::patchOrderStatus(@Body() body: PatchOrderDTO, @User() user) drop with error: ',
      //   error,
      // );      
      throw new BadRequestException({ message: error.message });
    }
  }

}
