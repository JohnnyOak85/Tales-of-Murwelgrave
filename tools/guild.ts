import { Guild } from 'discord.js';
import { startAreas } from '../helpers/game';
import { startRaffle } from '../helpers/raffle';
import { setCommands } from './commands';
import { logError, logInfo } from './logger';
import { recordMembers } from './member';

export const start = (guilds: Guild[]) => {
    try {
        logInfo(`The bot went online.`);

        for (const guild of guilds) {
            setCommands();
            startAreas(guild.channels);
            recordMembers(guild.members); // TODO review
            startRaffle();
        }

        console.log('Ready.');
    } catch (error) {
        logError(error);
    }
};
