import { Message } from 'discord.js';
import { getStats } from '../helpers/player';
import { logError } from '../tools/utils';

module.exports = {
  name: 'stats',
  description: 'Check your game stats',
  usage: ' ',
  execute: async (message: Message) => {
    try {
      message.reply(await getStats(message.guild?.id || '', message.author.id));
    } catch (error) {
      logError(error);
    }
  },
};
