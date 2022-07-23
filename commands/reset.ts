import { Message } from 'discord.js';
import { resetPlayer } from '../helpers/player';
import { logError } from '../tools/logger';

module.exports = {
  name: 'reset',
  description: `Reset a player's stats!`,
  usage: '<user>',
  moderation: true,
  execute: async (message: Message) => {
    try {
      const mentions = [...(message.mentions.members?.values() || [])];

      if (!mentions.length || message.member?.permissions.has('MANAGE_ROLES'))
        return;

      resetPlayer(message.guild?.id || '', mentions[0].id);

      message.reply(`<@${mentions[0].id}>'s stats have been reset!`);
    } catch (error) {
      logError(error);
    }
  },
};
