import {
  IsDate,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';


export enum TOrderType {
  SELL = 'SELL',
  BUY = 'BUY',
}

export enum TOrderStatus {
  CREATED = 'CREATED',
  READY = 'READY',
  DENIED = 'DENIED',
}

export type TOrdersFilter = {
  pageSize: number;
  pageNumber: number;
  status?: TOrderStatus[];
  name?: string,
  createDateFrom?: Date,
  createDateTo?: Date,
  id?: string,
  phone?: string
}

export type PatchOrderDTO = {
  // id: string;
  status: TOrderStatus;
  executionRate: number;
}

export class PostOrderDTO {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  wallet: string;

  @IsNumber()
  totalSum: number;

  @IsNumber()
  exchangeRate: number;

  @IsNumber()
  exchangeValue: number;

  @IsEnum(TOrderType)
  type: TOrderType;
}

export class GetOrderDTO {
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
  totalSum: number;

  @IsNumber()
  exchangeRate: number;

  @IsNumber()
  exchangeValue: number;

  @IsEnum(TOrderType)
  type: TOrderType;

  @IsDate()
  createdAt: Date;
}
