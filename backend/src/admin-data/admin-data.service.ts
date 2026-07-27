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
  private cachedBuyComission: number| null = null;
  private cachedSellComission: number| null = null;

  
  setRate(rateIn:number, rateOut:number){
    this.prevRateUpdateTime = new Date();
    this.prevRateIn = rateIn === 0 ? null : rateIn;
    this.prevRateOut =  rateOut === 0 ? null : rateOut;

  }

  getRates(){
    return {
      rates:{
        rateIn: Math.floor(this.prevRateIn * (1 + this.cachedBuyComission)*100)/100,//BUYRATE
        rateOut: Math.ceil(this.prevRateOut * (1 - this.cachedSellComission)*100)/100//SELLRATE
      }
    }
  }

  async getAdminData(): Promise<AdminDataDTO> {

    const wallet = this.cachedBuyWallet ?
                    this.cachedBuyWallet : 
                    (await this.adminDataRepository.findOneBy({key: "wallet"})).value;

    if(!this.cachedBuyComission || !this.cachedSellComission)
      this.cachedBuyWallet = wallet;

    const sellComission = this.cachedSellComission ?
                    this.cachedSellComission :
                    (await this.adminDataRepository.findOneBy({key: "comissionSell"})).value;

    if(!this.cachedSellComission)
      this.cachedSellComission = Number(sellComission)/100;

    const buyComission = this.cachedBuyComission ?
                    this.cachedBuyComission :
                    (await this.adminDataRepository.findOneBy({key: "comissionBuy"})).value;

    if(!this.cachedBuyComission)
      this.cachedBuyComission = Number(buyComission)/100;

    const data: AdminDataDTO = {
      buyWallet: wallet,
      comissionBuy: Number(buyComission) * 100,
      comissionSell: Number(sellComission) * 100,
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

    let comissionBuy = this.cachedBuyComission;
    let comissionSell = this.cachedSellComission;

    if(newData.comissionBuy){
      comissionBuy = (await this.adminDataRepository
        .createQueryBuilder()
        .update(AdminDataEntity)
        .set({ value: String(newData.comissionBuy) })
        .where('key = :key', { key: 'comissionBuy' })
        .returning('*')
        .execute()).raw[0].value/100;
        this.cachedBuyComission = comissionBuy;
    }

    if(newData.comissionSell){
      comissionSell = (await this.adminDataRepository
        .createQueryBuilder()
        .update(AdminDataEntity)
        .set({ value: String(newData.comissionSell) })
        .where('key = :key', { key: 'comissionSell' })
        .returning('*')
        .execute()).raw[0].value/100;
        this.cachedSellComission = comissionSell;
    }

    const data: AdminDataDTO = {
      buyWallet: wallet,
      comissionBuy: comissionBuy * 100,
      comissionSell: comissionSell * 100,
    }
    return data;
  }
}
