import { DevLogger } from './dev.logger';
import { LoggerService } from '@nestjs/common';
import {
  expect,
  describe,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

describe('DevLogger', () => {
  let logger: LoggerService;
  const timestamp = '2022-01-01T00:00:00.000Z';

  beforeEach(() => {
    logger = new DevLogger();

    const mockDate = new Date(timestamp);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log a message with timestamp', () => {
    const level = 'log';
    const logMessage = 'Test log message';
    const logContext = 'Test context';

    console.log = jest.fn();
    logger.log(logMessage, logContext);

    expect(console.log).toHaveBeenCalledWith(
      level,
      timestamp,
      logMessage,
      logContext,
    );
  });

  it('should error a message with timestamp', () => {
    const level = 'error';
    const errorMessage = 'Test error message';
    const stack = 'stack trace';
    const context = 'error context';

    console.error = jest.fn();
    logger.error(errorMessage, stack, context);

    expect(console.error).toHaveBeenCalledWith(
      level,
      timestamp,
      errorMessage,
      stack,
      context,
    );
  });

  it('should warn a message with timestamp', () => {
    const warnMessage = 'Test warn message';
    const context = 'warn context';
    const level = 'warn';

    console.warn = jest.fn();
    logger.warn(warnMessage, context);

    expect(console.warn).toHaveBeenCalledWith(
      level,
      timestamp,
      warnMessage,
      context,
    );
  });

  it('should debug a message with timestamp (non-production environment)', () => {
    process.env.NODE_ENV = 'development';
    const debugMessage = 'Test debug message';
    const context = 'debug context';
    const level = 'debug';

    console.debug = jest.fn();
    logger.debug(debugMessage, context);

    expect(console.debug).toHaveBeenCalledWith(
      level,
      timestamp,
      debugMessage,
      context,
    );
  });

  it('should not debug a message when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    const debugMessage = 'Test debug message';

    console.debug = jest.fn();
    logger.debug(debugMessage);

    expect(console.debug).not.toHaveBeenCalled();
  });
});
