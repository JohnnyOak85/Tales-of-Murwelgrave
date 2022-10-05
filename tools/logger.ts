import { createLogger, format, transports } from 'winston';
import { readFileSync } from 'fs'

const logger = createLogger({
    level: 'info',
    format: format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
    defaultMeta: { service: 'user-service' },
    transports: [new transports.File({ filename: 'logs/log.txt' })]
});

const getFuncName = (func: string) => (func ? `Function: ${func}` : '');
const getTime = () => `Time: ${new Date()}`;

export const logError = (error: any, func: string) =>
    typeof error === 'string'
        ? logger.log('error', `${error}\n${getFuncName(func)}\n${getTime()}`)
        : logger.log('error', `${error.message}\n${error}\n${getFuncName(func)}\n${getTime()}`);

export const logInfo = (message: string) => logger.log('info', `${message}\n${getTime()}`);

export const getLog = () => {
   const file = readFileSync('./logs/log.txt').toString().split("\n");
   const log = ['Log:'];

   file.forEach(line => {
        if (line.startsWith('[')) {
            log.push(line);
        }
   })

   return log;
}
