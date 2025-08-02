import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';

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
      transports: [
        new transports.Console({
          format: format.combine(
            format.printf(({ level, message, context, timestamp }) => {
              const appStr = chalk.green('[NEST]');
              const formatContext =
                context && typeof context === 'string' ? chalk.yellowBright(`[${String(context)}]`) : '';

              return `${appStr} - ${timestamp as string} - ${level.toUpperCase()}: ${formatContext} ${message as string}`;
            }),
          ),
        }),
        new transports.File({
          dirname: 'logs',
          filename: 'info.log',
          level: 'info',
          maxsize: 10240, // 10KB
          format: format.combine(format.json(), format.prettyPrint()),
        }),
      ],
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
