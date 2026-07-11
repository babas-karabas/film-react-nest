import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class DevLogger implements LoggerService {
  addTimestamp() {
    const timestamp = new Date().toISOString();
    return timestamp;
  }

  log(message: string, context?: string): void {
    console.log('log', this.addTimestamp(), message, context);
  }

  error(message: string, stack?: string, context?: string): void {
    console.error('error', this.addTimestamp(), message, stack, context);
  }

  warn(message: string, context?: string): void {
    console.warn('warn', this.addTimestamp(), message, context);
  }

  debug?(message: string, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('debug', this.addTimestamp(), message, context);
    }
  }
}
