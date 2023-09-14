// TODO: add https://github.com/winstonjs/winston-daily-rotate-file
// import chalk from 'chalk';
import { Service } from 'typedi';
import * as util from 'util';
// import * as winston from 'winston';
import { getBindingError } from 'warthog';
import winston, { createLogger, format, Logger as WinstonLogger } from 'winston';

// export type WinstonOptions = { logFilePath?: string; console?: boolean; jsonLogFilePath?: string };
type LogInput = any;

@Service('Logger')
export class Logger {
  winston: WinstonLogger;

  constructor() {
    const { combine, printf, timestamp, label, prettyPrint } = format;

    // const logDirectory = path.join(__dirname, '../../', 'logs');
    // const transports: winston.transport[] = [
    //   new winston.transports.File({
    //     dirname: logDirectory,
    //     filename: 'error.log',
    //     level: 'error',
    //   }),
    //   new winston.transports.File({
    //     dirname: logDirectory,
    //     filename: 'combined.log',
    //   }),
    // ];

    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: 'debug',
      }),
    ];

    // https://github.com/winstonjs/winston#formats
    // const myFormat = printf(({ level, message, label, timestamp }) => {
    //   return `[${level.toUpperCase()}] ${String(timestamp).substring(
    //     11,
    //     19
    //   )} [${label}] : ${message}`;
    // });

    this.winston = createLogger({
      exitOnError: false,
      // format: combine(label({ label: 'SCROOBIOUS' }), timestamp(), myFormat),
      transports,
    });
  }

  private _log(level: string, message: string, data?: unknown): void {
    // console.log('_log', typeof messages, Array.isArray(messages));
    // const combined = messages
    //   .map((message) => {
    //     if (message instanceof Error) {
    //       return message.message;
    //     } else if (Array.isArray(message)) {
    //       return JSON.stringify(message);
    //     } else if (typeof message == 'unknown') {
    //       return util.inspect(message, { showHidden: false, depth: null });
    //     }
    //     return message;
    //   })
    //   .join(' ');

    this.winston.log(level, message, data);
  }

  log(message: string, data?: unknown): void {
    this._log('info', message, data);
  }

  info(message: string, data?: unknown): void {
    this._log('info', message, data);
  }

  error(message: string, data?: unknown): void {
    this._log('error', message, data);
  }

  warn(message: string, data?: unknown): void {
    this._log('warn', message, data);
  }
  debug(message: string, data?: unknown): void {
    this._log('debug', message, data);
  }
  verbose(message: string, data?: unknown): void {
    this._log('verbose', message, data);
  }

  static logGraphQLError(error: Error) {
    console.error(util.inspect(getBindingError(error), { showHidden: false, depth: null }));
  }
}
