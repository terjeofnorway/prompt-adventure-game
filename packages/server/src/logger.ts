import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { timestamp: new Date().toISOString() },
  transports: [new winston.transports.File({ filename: 'logs.log' })],
});
