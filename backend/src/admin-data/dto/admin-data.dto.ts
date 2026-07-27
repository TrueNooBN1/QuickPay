import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminDataDTO {
  @IsNumber()
  @IsOptional()
  comissionBuy: number = null;

  @IsNumber()
  @IsOptional()
  comissionSell: number = null;

  @IsString()
  @IsOptional()
  buyWallet: string = null;
}
