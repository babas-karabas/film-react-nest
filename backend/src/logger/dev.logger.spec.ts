import { DevLogger } from './dev.logger';
import {
  describe,
  beforeEach,
  it,
  expect,
  jest,
  afterEach,
} from '@jest/globals';

import * as winston from 'winston';

jest.mock('winston');
const mockCurrentTime = '2023-10-05 14:30:00';

function checkFormat(call: [string, { timestamp?: string }]) {
  const timestamp = call[1].timestamp;
  if (!timestamp) return;

  const expectedPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  expect(timestamp).toMatch(expectedPattern);
  expect(timestamp).toBe(mockCurrentTime);
}

describe('DevLogger', () => {
  let logger: DevLogger;
  let winstonLogger: jest.Mocked<winston.Logger>;

  beforeEach(() => {
    winstonLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    (winston.createLogger as jest.Mock).mockReturnValue(winstonLogger);

    logger = new DevLogger();
    global.Date = jest.createMockFromModule('date') as typeof Date;
    (global.Date as jest.MockedClass<typeof Date>).now.mockReturnValue(
      new Date(mockCurrentTime).getTime(),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log method', () => {
    it('should call winston logger with info level and context', () => {
      const message = 'Test message';
      const context = 'test-context';

      logger.log(message, context);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, {
        context: context,
      });
      checkFormat(winstonLogger.info.mock.calls[0]);
    });
  });

  describe('error method', () => {
    it('should call winston logger with error level and context', () => {
      const message = 'Error message';
      const stack = 'stack-trace';
      const context = 'error-context';

      logger.error(message, stack, context);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, {
        context: context,
        stack: stack,
      });
    });
  });

  describe('warn method', () => {
    it('should call winston logger with warn level', () => {
      const message = 'Warning message';

      logger.warn(message);

      expect(winstonLogger.warn).toHaveBeenCalledWith(message);
    });
  });

  describe('debug method', () => {
    it('should call debug method if not in production', () => {
      process.env.NODE_ENV = 'development';
      const message = 'Debug message';

      logger.debug(message);

      expect(winstonLogger.debug).toHaveBeenCalledWith(message);
    });

    it('should not call debug method in production', () => {
      process.env.NODE_ENV = 'production';
      const message = 'Debug message';

      logger.debug(message);

      expect(winstonLogger.debug).not.toHaveBeenCalled();
    });
  });
});
