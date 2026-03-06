import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { configProvider } from './app.config.provider';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { DatabaseModule } from './database-module/database-module.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    DatabaseModule.register(configProvider.useValue.database.driver),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OrderController],
  providers: [configProvider, OrderService, ],
  exports: [configProvider],
})
export class AppModule {}
