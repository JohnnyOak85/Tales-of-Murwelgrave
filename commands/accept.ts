import { Message } from 'discord.js';
import { ARENA } from '../config';
import { acceptChallenge } from '../helpers/arena';
import { logError } from '../tools/logger';

module.exports = {
  name: 'accept',
  description: `Accept a challenge another user issued.`,
  usage: ' ',
  execute: async (message: Message) => {
    try {
      if (message.channel.id !== ARENA || message.channel.type !== 'GUILD_TEXT')
        return;

      acceptChallenge(message.channel, message.author.id);
    } catch (error) {
      logError(error);
    }
  },
};
