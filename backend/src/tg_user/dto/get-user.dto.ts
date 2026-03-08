import { IsArray, IsEmail, IsOptional, isString, IsString, IsUUID } from 'class-validator';


export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

export class GetUserDTO {
  @IsUUID()
  id: string;

  @IsString()
  telegramId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  wallet: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsArray()
  roles: UserRole[];
}
