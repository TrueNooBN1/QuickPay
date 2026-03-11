import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDataEntity } from './entitys/admin-data.entity';
import { AdminDataSeeder } from 'src/admin-data/seeder/admin-data.seeder';
import { AdminDataService } from './admin-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminDataEntity]),
  ],
  providers: [AdminDataService, AdminDataSeeder],
  exports: [AdminDataService], 
})

export class AdminDataModule implements OnModuleInit {
  constructor(private adminDataSeeder: AdminDataSeeder,private adminDataService: AdminDataService) {}
  async onModuleInit() {
    await this.adminDataSeeder.seed();
    await this.adminDataService.getAdminData();
  }
}
