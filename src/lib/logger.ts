/**
 * Structured logger for application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
  [key: string]: unknown;
}

class Logger {
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...meta,
    };

    // En desarrollo, mostramos logs bonitos en consola
    if (this.environment === 'development') {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, meta || '');
    } else {
      // En producción, JSON estructurado para herramientas de monitoreo
      const logMethod = level === 'error' ? console.error : console.log;
      logMethod(JSON.stringify(entry));
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.environment === 'development') {
      this.log('debug', message, meta);
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>) {
    const errorMeta = {
      ...meta,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    this.log('error', message, errorMeta);
  }
}

export const logger = new Logger();