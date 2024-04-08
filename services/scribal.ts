import Scribal from "@taikai/scribal";

import {elasticLoggerMaker} from "services/elastic-logger";

const ScribalConfig = {
  logService: {
    console: {
      silent: process.env.NEXT_LOG_TO_CONSOLE === 'false',
      logLevel: (process.env.NEXT_LOG_LEVEL || 'debug') as any,
    },
    elastic: {
      silent: process.env.NEXT_LOG_TO_ELASTIC === 'false',
      level: (process.env.NEXT_LOG_LEVEL || 'debug') as any,
    },
    file: {
      silent: process.env.NEXT_LOG_TO_FILE === 'false',
      logLevel: (process.env.NEXT_LOG_LEVEL || 'debug') as any,
      logFileDir: process.env.NEXT_LOG_FILE_DIR || 'logs',
      logDailyRotation: process.env.NEXT_DAILY_ROTATION_FILE === 'true',
      logDailyRotationOptions: {
        maxSize: process.env.NEXT_DAILY_ROTATION_FILE_MAX_SIZE || '20m',
        datePattern: process.env.NEXT_DAILY_ROTATION_FILE_DATE_PATTERN || 'YYYY-MM-DD',
      },
    },
  }
}

export default (() => {
  const appName = process.env.NEXT_LOG_APP_NAME || `webnetwork-logs`;
  const hostname = process.env.NEXT_LOG_HOST_NAME || `localhost`;

  const scribal = new Scribal([]);
  scribal.init({appName, hostname, version: '*', ...ScribalConfig.logService});
  scribal.addLogger(() => elasticLoggerMaker(), ScribalConfig.logService.elastic);

  return scribal;
})()