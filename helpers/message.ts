import { Message } from 'discord.js';
import { checkWord } from './raffle';
import { logError } from '../tools/utils';
import { executeCommand } from '../tools/commands';

export const clearMessage = (list: Message[], id: string) => {
  const message = list.find((m) => m.id === id);
  message?.delete();
};

export const checkIncomingMessage = async (message: Message) => {
  if (message.channel.type === 'DM' || message.author.bot) return;

  try {
    if (message.guild) {
      // incrementMessages(
      //   message.guild,
      //   message.author.id,
      //   checkWord(message.content.split(' '))
      // );
    }

    executeCommand(message);
  } catch (error) {
    logError(error);
  }
};
