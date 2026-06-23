import { describe, it, expect } from 'vitest';
import { Logger, LogLevel } from '@/utils/logger';

describe('Logger', () => {
  it('should create a named instance', () => {
    const logger = Logger.getInstance('test', { level: LogLevel.DEBUG });
    expect(logger).toBeDefined();
  });

  it('should return the same instance for the same name', () => {
    const a1 = Logger.getInstance('test2');
    const a2 = Logger.getInstance('test2');
    expect(a1).toBe(a2);
  });
});
