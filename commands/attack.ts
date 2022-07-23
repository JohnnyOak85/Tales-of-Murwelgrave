import { Message } from 'discord.js';
import { engageMonster } from '../helpers/monster';
import { logError } from '../tools/logger';

module.exports = {
  name: 'attack',
  description: `Attack a spawned monster!`,
  usage: ' ',
  execute: async (message: Message) => {
    try {
      if (message.channel.type !== 'GUILD_TEXT') return;

      engageMonster(message.channel, message.author.id);
    } catch (error) {
      logError(error);
    }
  },
};
