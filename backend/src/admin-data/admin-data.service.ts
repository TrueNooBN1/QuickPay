import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOperator, FindOptionsWhere, In, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { AdminDataEntity } from 'src/admin-data/entitys/admin-data.entity';
import { AdminDataDTO } from 'src/admin-data/dto/admin-data.dto';

@Injectable()
export class AdminDataService {
  constructor(
    @InjectRepository(AdminDataEntity)
    private adminDataRepository: Repository<AdminDataEntity>,
    private dataSource: DataSource,
  ) {
  }


  private prevRateIn: number | null = null;
  private prevRateOut: number | null = null;
  private prevRateUpdateTime: Date | null = null;
  private cachedBuyWallet: string| null = null;
  private cachedComission: number| null = null;

  
  setRate(rateIn:number, rateOut:number){
    this.prevRateUpdateTime = new Date();
    this.prevRateIn = rateIn === 0 ? null : rateIn;
    this.prevRateOut =  rateOut === 0 ? null : 1/rateOut;

  }

  getRates(){
    return {
      rates:{
        rateIn: Math.floor(this.prevRateIn * (1 + this.cachedComission)*100)/100,
        rateOut: Math.ceil(this.prevRateOut * (1 - this.cachedComission)*100)/100
      }
    }
  }

  async getAdminData(): Promise<AdminDataDTO> {

    const wallet = this.cachedBuyWallet ?
                    this.cachedBuyWallet : 
                    (await this.adminDataRepository.findOneBy({key: "wallet"})).value;

    if(!this.cachedComission)
      this.cachedBuyWallet = wallet;

    const comission = this.cachedComission ?
                    this.cachedComission :
                    (await this.adminDataRepository.findOneBy({key: "comission"})).value;

    if(!this.cachedComission)
      this.cachedComission = Number(comission)/100;
    const data: AdminDataDTO = {
      buyWallet: wallet,
      comission: Number(comission) * 100,
    }
    return data;
  }

  async patchAdminData(newData: AdminDataDTO): Promise<AdminDataDTO> {
    let wallet = this.cachedBuyWallet;
    if(newData.buyWallet){
      wallet = (await this.adminDataRepository
        .createQueryBuilder()
        .update(AdminDataEntity)
        .set({ value: newData.buyWallet })
        .where('key = :key', { key: 'wallet' })
        .returning('*')
        .execute()).raw[0].value;
        this.cachedBuyWallet = wallet;
    }

    let comission = this.cachedComission;
    if(newData.comission){
      comission = (await this.adminDataRepository
        .createQueryBuilder()
        .update(AdminDataEntity)
        .set({ value: String(newData.comission) })
        .where('key = :key', { key: 'comission' })
        .returning('*')
        .execute()).raw[0].value/100;
        this.cachedComission = comission;
    }

    const data: AdminDataDTO = {
      buyWallet: wallet,
      comission: comission * 100,
    }
    return data;
  }
}
