import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    return JSON.stringify({ level, message, context, stack });
  }

  log(message: string, context?: string): void {
    console.log(this.formatMessage('log', message, context));
  }

  error(message: string, stack?: string, context?: string): void {
    console.error(this.formatMessage('error', message, stack, context));
  }

  warn(message: string, context?: string): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug?(message: string, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose?(message: string, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
