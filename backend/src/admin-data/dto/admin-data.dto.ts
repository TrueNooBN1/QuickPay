import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminDataDTO {
  @IsNumber()
  @IsOptional()
  comission: number = null;

  @IsString()
  @IsOptional()
  buyWallet: string = null;
}
