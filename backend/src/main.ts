import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { configProvider } from './app.config.provider';
import { LoggerFactory } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  console.log(configProvider.useValue.database);
  const loggerFactory = new LoggerFactory(configProvider.useValue.loggerType);
  const logger = loggerFactory.createLogger();
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
