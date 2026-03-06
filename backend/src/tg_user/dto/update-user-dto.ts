import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';


export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}


export class UpdateUserDTO {
  @IsOptional()
  @IsEmail()
  wallet?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}