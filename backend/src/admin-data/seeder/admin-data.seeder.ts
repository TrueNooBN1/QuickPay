// seeders/admin-data.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminDataEntity } from '../entitys/admin-data.entity';

@Injectable()
export class AdminDataSeeder {
  constructor(
    @InjectRepository(AdminDataEntity)
    private adminDataRepository: Repository<AdminDataEntity>,
  ) {}

  async seed() {
    const count = await this.adminDataRepository.count();
    
    if (count === 0) {
      console.log('🌱 Seeding admin data...');
      
      const data = [
        { key: 'comission', value: '2' },
        { key: 'wallet', value: 'Application description' },
        { key: 'maintenance_mode', value: 'false' },
      ];

      await this.adminDataRepository.save(data);
      console.log('✅ Seeding completed!');
    } else {
      console.log('⏭️ Admin data already exists, skipping seed');
    }
  }
}