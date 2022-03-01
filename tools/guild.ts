import { Guild } from 'discord.js';
import { startAreas } from '../helpers/game';
import { startRaffle } from '../helpers/raffle';
import { setCommands } from './commands';
import { recordMembers } from './member';
import { logError, logInfo } from './utils';

export const start = (guilds: Guild[]) => {
  try {
    logInfo(`The bot went online.`);

    for (const guild of guilds) {
      setCommands();
      startAreas([...guild.channels.cache.values()]);
      recordMembers([...guild.members.cache.values()]);
      startRaffle();
    }

    console.log('Ready.');
  } catch (error) {
    logError(error);
  }
};
