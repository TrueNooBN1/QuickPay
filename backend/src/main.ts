import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { configProvider } from './app.config.provider';
import { LoggerFactory } from './logger/logger.factory';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { ConfigType } from '@nestjs/config';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api/exchanger/');
  app.enableCors({
    origin: config.cors.origin, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: config.cors.credentials,
  });

  const loggerFactory = new LoggerFactory(configProvider.useValue.loggerType);
  const logger = loggerFactory.createLogger();
  app.useLogger(logger);
  await app.listen(config.port);
}
bootstrap();
