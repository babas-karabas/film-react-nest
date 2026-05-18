import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class TSKVLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.printf((info) =>
        this.formatTSKV({
          timestamp: info.timestamp as string,
          service: info.service as string,
          level: info.level,
          message: info.value,
        }),
      ),
      transports: [new winston.transports.File({ filename: 'logs/tskv.log' })],
    });
  }

  private formatTSKV({
    timestamp,
    service,
    level,
    message,
  }: {
    timestamp: string;
    service: string;
    level: string;
    message: unknown;
  }): string {
    return `${timestamp} ${service} ${level}=${message}\n`;
  }

  log(message: string, context?: string): void {
    const timestamp = new Date(Date.now()).toISOString();
    this.logger.log({
      timestamp: timestamp,
      service: context || 'unknown',
      level: 'info',
      message: message,
    });
  }

  error(message: string, context?: string): void {
    const timestamp = new Date(Date.now()).toISOString();
    this.logger.error({
      timestamp: timestamp,
      service: context || 'unknown',
      level: 'error',
      message: message,
    });
  }

  warn(message: any, context?: string): void {
    const timestamp = new Date(Date.now()).toISOString();
    this.logger.warn({
      timestamp: timestamp,
      service: context || 'unknown',
      level: 'warn',
      message: message,
    });
  }

  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date(Date.now()).toISOString();
      this.logger.debug({
        timestamp: timestamp,
        service: context || 'unknown',
        level: 'debug',
        message: message,
      });
    }
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date(Date.now()).toISOString();
      this.logger.verbose({
        timestamp: timestamp,
        service: context || 'unknown',
        level: 'verbose',
        message: message,
      });
    }
  }
}
