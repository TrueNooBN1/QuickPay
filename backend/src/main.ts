import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { configProvider } from './app.config.provider';
import { LoggerFactory } from './logger/logger.factory';
import { SuccessInterceptor } from './interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api/exchanger/');
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const loggerFactory = new LoggerFactory(configProvider.useValue.loggerType);
  const logger = loggerFactory.createLogger();
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
