import { Message } from 'discord.js';
import { ARENA } from '../config';
import { issueChallenge } from '../helpers/arena';
import { logError } from '../tools/utils';

module.exports = {
  name: 'challenge',
  description: `Challenge another user to combat!`,
  usage: '<user>',
  execute: async (message: Message) => {
    try {
      const mentions = [...(message.mentions.members?.values() || [])];

      if (
        !mentions.length ||
        message.channel.id !== ARENA ||
        message.channel.type !== 'GUILD_TEXT'
      )
        return;

      if (message.author.id === mentions[0].id) {
        message.reply('this is not the way to challenge yourself.');
        return;
      }

      if (mentions[0].user.bot) {
        message.reply('do not challenge a bot, you will lose.');
        return;
      }

      issueChallenge(message.channel, message.author.id, mentions[0].id);
    } catch (error) {
      logError(error);
    }
  },
};
