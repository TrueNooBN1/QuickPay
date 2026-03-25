import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { IJwtConfig, jwtConfig } from './config/jwt.config';
import { dbConfig } from './config/db.config';
import { ServeStaticModule } from '@nestjs/serve-static';
// import path from 'path';
import { join } from 'path';
import { TelegramAuthModule } from './tg_auth/tg_auth.module';
import { TelegramUserModule } from './tg_user/tg_user.module';
import { OrderModule } from './order/order.module';
import { WebSocketClientModule } from './grinex-web-socket/grinex-web-socket.module';
import { XLSXExportModule } from './xlsxexport/xlsxexport.module';
import { EmailModule } from './email-module/src/email';
import emailConfig from './email-module/src/config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, dbConfig, emailConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [dbConfig.KEY],
      useFactory: (db: ConfigType<typeof dbConfig>) => db,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),


    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: IJwtConfig) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expiresIn,
        },
      }),
    }),

    WebSocketClientModule,

    TelegramUserModule,
    TelegramAuthModule,
    OrderModule,
    XLSXExportModule,
    EmailModule
  ],
})
export class AppModule { }