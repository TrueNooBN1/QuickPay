import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entitys/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AdminDataEntity } from 'src/admin-data/entitys/admin-data.entity';
import { AdminDataService } from 'src/admin-data/admin-data.service';
import { AdminDataModule } from 'src/admin-data/admin-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    AdminDataModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService], 
})

export class OrderModule {}
