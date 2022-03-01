import { Message } from 'discord.js';
import { logError } from '../tools/utils';

module.exports = {
  name: 'ping',
  description: 'Check if the bot is on',
  usage: ' ',
  moderation: true,
  game: false,
  execute: async (message: Message) => {
    try {
      message.reply('Pong!');
    } catch (error) {
      logError(error);
    }
  },
};
