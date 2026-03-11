import { Module, Global } from '@nestjs/common';
import { GrinexWebSocketService } from './grinex-web-socket.service';
import { AdminDataModule } from 'src/admin-data/admin-data.module';

@Global() // если нужно использовать сервис везде
@Module({
  imports: [AdminDataModule],
  providers: [GrinexWebSocketService],
  exports: [GrinexWebSocketService],
})
export class WebSocketClientModule {}