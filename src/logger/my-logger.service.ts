import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger } from 'winston';
import 'winston-daily-rotate-file';
import transportsInstance from './my-logger.config';

@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp({
          format: () => dayjs().format('YYYY/MM/DD hh:mm:ss A'),
        }),
      ),
      transports: transportsInstance,
    });
  }
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }
  error(message: string, context?: string) {
    this.logger.error('error', message, { context });
  }
  warn(message: string, context?: string) {
    this.logger.warn('warn', message, { context });
  }
  debug?(message: string, context?: string) {
    this.logger.debug('debug', message, { context });
  }
  verbose?(message: string, context?: string) {
    this.logger.verbose('verbose', message, { context });
  }
  fatal?(message: string, context?: string) {
    this.logger.log('fatal', message, { context });
  }
  setLogLevels?(levels: LogLevel[]) {
    // this.logger.log('');
  }
}
