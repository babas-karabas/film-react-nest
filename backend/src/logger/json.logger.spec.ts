import { JsonLogger } from './json.logger';
import { LoggerService } from '@nestjs/common';
import { expect, describe, it, jest, beforeEach } from '@jest/globals';

describe('JsonLogger', () => {
  let logger: LoggerService;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('should log a message in JSON format', () => {
    const logMessage = 'Test log message';
    const logContext = 'Test context';
    const expectedOutput = JSON.stringify({
      level: 'log',
      message: logMessage,
      context: logContext,
    });

    console.log = jest.fn();
    logger.log(logMessage, logContext);

    expect(console.log).toHaveBeenCalledWith(expectedOutput);
  });

  it('should error a message in JSON format', () => {
    const errorMessage = 'Test error message';
    const stack = 'stack trace';
    const context = 'error context';
    const expectedOutput = JSON.stringify({
      level: 'error',
      message: errorMessage,
      stack: stack,
      context: context,
    });

    console.error = jest.fn();
    logger.error(errorMessage, stack, context);

    expect(console.error).toHaveBeenCalledWith(expectedOutput);
  });

  it('should warn a message in JSON format', () => {
    const warnMessage = 'Test warn message';
    const context = 'warn context';
    const expectedOutput = JSON.stringify({
      level: 'warn',
      message: warnMessage,
      context: context,
    });

    console.warn = jest.fn();
    logger.warn(warnMessage, context);

    expect(console.warn).toHaveBeenCalledWith(expectedOutput);
  });

  it('should debug a message in JSON format (non-production environment)', () => {
    process.env.NODE_ENV = 'development';
    const debugMessage = 'Test debug message';
    const context = 'debug context';
    const expectedOutput = JSON.stringify({
      level: 'debug',
      message: debugMessage,
      context: context,
    });

    console.debug = jest.fn();
    logger.debug(debugMessage, context);

    expect(console.debug).toHaveBeenCalledWith(expectedOutput);
  });

  it('should not debug a message when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    const debugMessage = 'Test debug message';

    console.debug = jest.fn();
    logger.debug(debugMessage);

    expect(console.debug).not.toHaveBeenCalled();
  });

  it('should verbose a message in JSON format', () => {
    process.env.NODE_ENV = 'development';
    const verboseMessage = 'Test verbose message';
    const context = 'verbose context';
    const expectedOutput = JSON.stringify({
      level: 'verbose',
      message: verboseMessage,
      context: context,
    });

    console.log = jest.fn();
    logger.verbose(verboseMessage, context);

    expect(console.log).toHaveBeenCalledWith(expectedOutput);
  });
});
