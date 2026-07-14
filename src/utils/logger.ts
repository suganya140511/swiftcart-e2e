/* eslint-disable no-console */

/**
 * Minimal structured logger. Keeps test output readable in CI logs without
 * pulling in a heavy logging dependency. Swap the sink here if you later want
 * to route to a file or an external service.
 */
type Level = 'INFO' | 'WARN' | 'ERROR' | 'STEP';

function emit(level: Level, message: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] ${message}`);
}

export const logger = {
  info: (msg: string): void => emit('INFO', msg),
  warn: (msg: string): void => emit('WARN', msg),
  error: (msg: string): void => emit('ERROR', msg),
  step: (msg: string): void => emit('STEP', msg),
};
