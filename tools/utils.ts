import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import { LEVEL_CONTROL } from '../config.json';

const logger = createLogger({
  level: 'info',
  format: format.printf(
    (log) => `[${log.level.toUpperCase()}] - ${log.message}`
  ),
  defaultMeta: { service: 'user-service' },
  transports: [new transports.File({ filename: 'logs/log.txt' })],
});

export const getDate = (
  date = new Date(),
  timeFormat = 'Do MMMM YYYY, h:mm:ss a'
) => moment(date).format(timeFormat);

const checkControl = (num: number) =>
  num * LEVEL_CONTROL + (num - 1) * LEVEL_CONTROL;

export const getRandom = (max = 100, min = 1) =>
  Math.floor(Math.random() * (max - min + 1) + min);
export const increment = (num: number, toInc: number) =>
  num >= checkControl(toInc) ? toInc + 1 : toInc;
export const getBool = () => Math.random() < 0.5;

export const checkRepeats = (str: string) =>
  str.length === (str.match(new RegExp(str[0], 'g')) || []).length;

export const logError = (error: any) =>
  logger.log('error', `${error.message}\n${error}\nTime: ${getDate()}`);
export const logInfo = (message: string) =>
  logger.log('info', `${message}\nTime: ${getDate()}`);
