import { Message } from 'discord.js';
import { getPlayerStats } from '../helpers/player';
import { logError } from '../tools/logger';

module.exports = {
    name: 'stats',
    description: 'Check your game stats',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            message.reply(await getPlayerStats(message.guild?.id || '', message.author.id));
        } catch (error) {
            logError(error);
        }
    }
};
