import { TSKVLogger } from './tskv.logger';
import { LoggerService } from '@nestjs/common';
import {
  expect,
  describe,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

describe('TSKVLogger', () => {
  let logger: LoggerService;

  beforeEach(() => {
    logger = new TSKVLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log a message', () => {
    const logMessage = 'Test log message';
    const logContext = 'Test context';
    jest.spyOn(logger['logger'], 'info').mockImplementation(() => {});

    logger.log(logMessage, logContext);
    expect(logger['logger'].info).toHaveBeenCalledWith(logMessage, {
      service: logContext,
    });
  });

  it('should error a message', () => {
    const logMessage = 'Test error message';
    const logContext = 'Test context';
    const stack = 'Stack';

    jest.spyOn(logger['logger'], 'error').mockImplementation(() => {});

    logger.error(logMessage, stack, logContext);
    expect(logger['logger'].error).toHaveBeenCalledWith(logMessage, stack, {
      service: logContext,
    });
  });

  it('should warn a message', () => {
    const logMessage = 'Test error message';
    const logContext = 'Test context';
    jest.spyOn(logger['logger'], 'warn').mockImplementation(() => {});

    logger.warn(logMessage, logContext);
    expect(logger['logger'].warn).toHaveBeenCalledWith(logMessage, {
      service: logContext,
    });
  });

  it('should debug a message', () => {
    const logMessage = 'Test error message';
    const logContext = 'Test context';
    process.env.NODE_ENV != 'production';

    jest.spyOn(logger['logger'], 'debug').mockImplementation(() => {});

    logger.debug(logMessage, logContext);
    expect(logger['logger'].debug).toHaveBeenCalledWith(logMessage, {
      service: logContext,
    });
  });

  it('should not debug a message in production', () => {
    const logMessage = 'Test error message';
    const logContext = 'Test context';
    process.env.NODE_ENV = 'production';

    jest.spyOn(logger['logger'], 'debug').mockImplementation(() => {});

    logger.debug(logMessage, logContext);
    expect(logger['logger'].debug).not.toHaveBeenCalled();
  });
});
