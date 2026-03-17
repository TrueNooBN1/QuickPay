import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/order/entitys/order.entity';
import { XLSXExportController } from './xlsxexport.controller';
import { XLSXExportService } from './xlsxexport.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([OrderEntity]),
    ],
    controllers: [XLSXExportController],
    providers: [XLSXExportService],
    exports: [XLSXExportService], 
  
})
export class XLSXExportModule {}
