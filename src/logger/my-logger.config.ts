import chalk from 'chalk';
import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';

const consoleTransport: ConsoleTransportInstance = new transports.Console({
  format: format.combine(
    format.printf(({ level, message, context, timestamp }) => {
      const appStr = chalk.green('[NEST]');
      const formatContext = context && typeof context === 'string' ? chalk.yellowBright(`[${String(context)}]`) : '';

      return `${appStr} - ${timestamp as string} - ${level.toUpperCase()}: ${formatContext} ${message as string}`;
    }),
  ),
});

const fileTransport: FileTransportInstance = new transports.File({
  dirname: 'logs',
  level: 'info',
  filename: 'info.log',
  maxsize: 10240, // 10KB
  format: format.combine(format.json(), format.prettyPrint()),
});

const dailyFileTransport: DailyRotateFile = new transports.DailyRotateFile({
  dirname: 'logs',
  level: 'info',
  filename: 'info-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: 10240, // 10KB
  format: format.combine(format.json(), format.prettyPrint()),
});

const transportsInstance = [consoleTransport, fileTransport, dailyFileTransport];

export default transportsInstance;
