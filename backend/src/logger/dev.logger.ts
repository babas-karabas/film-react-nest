import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class DevLogger implements LoggerService {
  addTimestamp() {
    const timestamp = new Date().toISOString();
    return timestamp;
  }

  log(message: any, context?: string): void {
    console.log('log', this.addTimestamp(), message, context);
  }

  error(message: any, stack?: string, context?: string): void {
    console.error('error', this.addTimestamp(), message, stack, context);
  }

  warn(message: any, context?: string): void {
    console.warn('warn', this.addTimestamp(), message, context);
  }

  debug?(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('debug', this.addTimestamp(), message, context);
    }
  }
}
