import { JsonLogger } from './json.logger';
import { TSKVLogger } from './tskv.logger';
import { DevLogger } from './dev.logger';

export const createLogger = () => {
  const loggerType = process.env.LOGGER_TYPE || 'json'; // по умолчанию 'json'

  switch (loggerType) {
    case 'tskv':
      return new TSKVLogger();
    case 'json':
      return new JsonLogger();
    default:
      return new DevLogger();
  }
};
