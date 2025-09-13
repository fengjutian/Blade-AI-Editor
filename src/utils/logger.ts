// 日志级别枚举
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// 日志配置接口
interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  showTimestamp?: boolean;
}

/**
 * 日志工具类
 * 提供统一的日志记录功能，支持不同级别的日志输出
 */
export class Logger {
  private level: LogLevel;
  private prefix?: string;
  private showTimestamp: boolean;
  private static instance: Logger;

  private constructor(config: LoggerConfig = { level: LogLevel.INFO, showTimestamp: true }) {
    this.level = config.level;
    this.prefix = config.prefix;
    this.showTimestamp = config.showTimestamp;
  }

  /**
   * 获取Logger单例实例
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    } else if (config) {
      // 更新已存在实例的配置
      if (config.level) Logger.instance.level = config.level;
      if (config.prefix !== undefined) Logger.instance.prefix = config.prefix;
      if (config.showTimestamp !== undefined) Logger.instance.showTimestamp = config.showTimestamp;
    }
    return Logger.instance;
  }

  /**
   * 检查是否应该输出该级别的日志
   */
  private shouldLog(logLevel: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(logLevel) >= levels.indexOf(this.level);
  }

  /**
   * 生成日志前缀
   */
  private getLogPrefix(logLevel: LogLevel): string {
    const timestamp = this.showTimestamp
      ? new Date().toISOString()
      : '';
    
    const level = logLevel.toUpperCase();
    const prefix = this.prefix ? `[${this.prefix}]` : '';
    
    return timestamp ? `${timestamp} [${level}] ${prefix}` : `[${level}] ${prefix}`;
  }

  /**
   * 调试日志
   */
  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.getLogPrefix(LogLevel.DEBUG), message, ...args);
    }
  }

  /**
   * 信息日志
   */
  public info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.getLogPrefix(LogLevel.INFO), message, ...args);
    }
  }

  /**
   * 警告日志
   */
  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.getLogPrefix(LogLevel.WARN), message, ...args);
    }
  }

  /**
   * 错误日志
   */
  public error(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const logArgs = error ? [message, error, ...args] : [message, ...args];
      console.error(this.getLogPrefix(LogLevel.ERROR), ...logArgs);
    }
  }

  /**
   * 致命错误日志
   */
  public fatal(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      const logArgs = error ? [message, error, ...args] : [message, ...args];
      console.error(this.getLogPrefix(LogLevel.FATAL), ...logArgs);
    }
  }

  /**
   * 记录API请求
   */
  public logApiRequest(method: string, url: string, status: number, duration: number): void {
    this.info(`API Request: ${method} ${url} - Status: ${status} - Duration: ${duration}ms`);
  }

  /**
   * 记录数据库操作
   */
  public logDatabaseOperation(operation: string, table: string, success: boolean, duration?: number): void {
    const status = success ? 'SUCCESS' : 'FAILED';
    const durationStr = duration !== undefined ? ` - Duration: ${duration}ms` : '';
    const logMethod = success ? this.info.bind(this) : this.error.bind(this);
    logMethod(`Database ${operation.toUpperCase()} on ${table} ${status}${durationStr}`);
  }
}

// 创建默认的logger实例供直接使用
export const logger = Logger.getInstance({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  showTimestamp: true,
});

export default logger;