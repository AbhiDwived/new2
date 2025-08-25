const isDev = import.meta.env.MODE === 'development';

export const logger = {
  log: (message, ...args) => {
    if (isDev) console.log(message, ...args);
  },
  warn: (message, ...args) => {
    if (isDev) console.warn(message, ...args);
  },
  error: (message, ...args) => {
    // Always log errors, but sanitize in production
    if (!isDev) {
      // Remove sensitive data in production
      args = args.map(arg => {
        if (typeof arg === 'object') {
          return { message: arg.message || 'Error object sanitized' };
        }
        return arg;
      });
    }
    console.error(message, ...args);
  }
}; 