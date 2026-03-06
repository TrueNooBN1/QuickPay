import { Injectable, LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TSKVLogger } from './tskv.logger';

export enum LoggerType {
  dev = 'dev',
  json = 'json',
  tskv = 'tskv',
}

@Injectable()
export class LoggerFactory {
  constructor(private loggerType: LoggerType = LoggerType.dev) {}

  createLogger(): LoggerService {
    switch (this.loggerType) {
      case LoggerType.json:
        return new JsonLogger();
      case LoggerType.tskv:
        return new TSKVLogger();
      case LoggerType.dev:
      default:
        return new DevLogger();
    }
  }
}
