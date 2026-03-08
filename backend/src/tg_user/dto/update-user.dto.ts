import { IsArray, IsEmail, IsOptional, isString, IsString, IsUUID } from 'class-validator';



export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  wallet?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}