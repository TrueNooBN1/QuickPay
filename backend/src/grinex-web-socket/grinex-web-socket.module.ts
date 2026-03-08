import { Module, Global } from '@nestjs/common';
import { GrinexWebSocketService } from './grinex-web-socket.service';
import { OrderModule } from 'src/order/order.module';

@Global() // если нужно использовать сервис везде
@Module({
  imports: [OrderModule],
  providers: [GrinexWebSocketService],
  exports: [GrinexWebSocketService],
})
export class WebSocketClientModule {}