/**
 * Thin logging wrapper.
 * Only outputs to the browser console in development mode.
 * In production builds (import.meta.env.DEV === false) all calls are no-ops.
 */
const isDev = import.meta.env.DEV;

const logger = {
  log:   (...args) => isDev && console.log(...args),
  warn:  (...args) => isDev && console.warn(...args),
  error: (...args) => isDev && console.error(...args),
  info:  (...args) => isDev && console.info(...args),
};

export default logger;
