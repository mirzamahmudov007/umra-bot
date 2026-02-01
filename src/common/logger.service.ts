import { Injectable, Logger } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Injectable()
export class LoggerService {
  private logger = new Logger('UmraBot');

  log(context: string, message: string, data?: any) {
    const log = `[${new Date().toISOString()}] [${context}] ${message}`;
    if (data) {
      this.logger.log(`${log} | Data: ${JSON.stringify(data)}`);
    } else {
      this.logger.log(log);
    }
  }

  info(context: string, message: string, data?: any) {
    this.log(`INFO:${context}`, message, data);
  }

  warn(context: string, message: string, data?: any) {
    const log = `[${new Date().toISOString()}] [WARN:${context}] ${message}`;
    if (data) {
      this.logger.warn(`${log} | Data: ${JSON.stringify(data)}`);
    } else {
      this.logger.warn(log);
    }
  }

  error(context: string, message: string, error?: any, data?: any) {
    const log = `[${new Date().toISOString()}] [ERROR:${context}] ${message}`;
    const errorInfo = error instanceof Error ? error.message : String(error);
    if (data) {
      this.logger.error(`${log} | Error: ${errorInfo} | Data: ${JSON.stringify(data)}`);
    } else {
      this.logger.error(`${log} | Error: ${errorInfo}`);
    }
  }

  debug(context: string, message: string, data?: any) {
    if (process.env.DEBUG_MODE === 'true') {
      this.log(`DEBUG:${context}`, message, data);
    }
  }
}
