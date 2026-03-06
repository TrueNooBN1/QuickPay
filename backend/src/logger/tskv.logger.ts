import { LoggerService, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TSKVLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const filteredMessage = message.replace('\t', ' ');
    return `level=${level}\tmessage=${filteredMessage}\toptionalParams=${JSON.stringify(optionalParams)}\n`;
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  /**
   * Write a 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, optionalParams));
  }

  /**
   * Write a 'verboose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
