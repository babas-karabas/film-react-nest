import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
const { timestamp, printf, errors, combine } = winston.format;

@Injectable()
export class TSKVLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        printf(
          (info) =>
            `tskv\t[${info.timestamp}]\tlevel=${info.level}\tservice=${info.service}\tmessage=${info.message}\n`,
        ),
      ),
      transports: [new winston.transports.File({ filename: 'logs/tskv.log' })],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { service: context || 'unknown' });
  }

  error(message: any, stack?: string, context?: string): void {
    this.logger.error(message, stack, { service: context || 'unknown' });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { service: context || 'unknown' });
  }

  debug?(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(message, { service: context || 'unknown' });
    }
  }

  verbose?(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.verbose(message, {
        service: context || 'unknown',
      });
    }
  }
}
