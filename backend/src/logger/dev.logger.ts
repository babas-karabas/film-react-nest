import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class DevLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // базовый уровень логирования
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.simple(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, stack?: string, context?: string): void {
    this.logger.error(message, { context, stack });
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(message);
    }
  }
}
