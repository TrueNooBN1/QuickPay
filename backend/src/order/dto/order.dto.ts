//TODO реализовать DTO для /orders

import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';


export enum TOrderType {
  SELL = 'Sell',
  BUY = 'Buy',
}

export enum TOrderStatus {
  CREATED = 'created',
  READY = 'ready',
  DENIED = 'denied',
}

export type TOrdersFilter = {
  pageSize: number;
  pageNumber: number;
}

export type PatchOrderDTO = {
  id: string;
  status: TOrderStatus;
}

export class PostOrderDTO {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  wallet: string;

  @IsEnum(TOrderStatus)
  status: TOrderStatus;

  @IsNumber()
  amount: number;

  @IsEnum(TOrderType)
  type: TOrderType;

  @IsDate()
  createdAt: Date;
}
