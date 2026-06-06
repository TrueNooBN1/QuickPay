import { Module, Global } from '@nestjs/common';
import { RapiraRateUpdaterService } from './rapira-rate-updater.service';
import { AdminDataModule } from 'src/admin-data/admin-data.module';
import { HttpModule } from '@nestjs/axios'; 

@Global() 
@Module({
  imports: [
    AdminDataModule,
    HttpModule,
  ],
  providers: [RapiraRateUpdaterService],
  exports: [RapiraRateUpdaterService],
})
export class RapiraRateUpdaterModule {}
