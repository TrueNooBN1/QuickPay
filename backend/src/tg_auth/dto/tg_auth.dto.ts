import { IsString} from 'class-validator';

export class TelegramAuthDTO {
  @IsString()
  telegramId: string;

  @IsString()
  initData: string;
}

// export class TelegramAuthDTO {
//   @IsEmail()
//   email: string;

//   @IsString()
//   @MinLength(6)
//   password: string;

//   @IsString()
//   @IsOptional()
//   name?: string;
// }

export class RefreshDTO {
  @IsString()
  refreshToken: string;
}