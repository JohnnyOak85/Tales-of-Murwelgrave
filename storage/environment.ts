import { config } from 'dotenv';
import { logError } from '../tools/logger';

export const readEnvironment = () => {
    const env = config(); // Give full path

    if (env.error) {
        logError(env.error, 'readEnvironment');
        throw `Error parsing environment file: ${env.error.message}`;
    }
};
