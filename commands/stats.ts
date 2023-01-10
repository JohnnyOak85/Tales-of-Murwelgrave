import { Message } from 'discord.js';
import { getPlayerStats } from '../battles/player';
import { logError } from '../tools/logger';

module.exports = {
    name: 'stats',
    description: 'Check your stats',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member) return;

            const playerInfo = {
                id: message.author.id,
                name: message.author.username,
                titles: message.member.roles.valueOf().map(role => role.id)
            };

            getPlayerStats(playerInfo, message);
        } catch (error) {
            logError(error, 'command -> stats');
        }
    }
};
