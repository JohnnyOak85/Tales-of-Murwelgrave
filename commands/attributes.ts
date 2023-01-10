import { Message } from 'discord.js';
import { getPlayerAttributes } from '../battles/player';
import { logError } from '../tools/logger';

module.exports = {
    name: 'attributes',
    description: 'Check your attributes',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member) return;

            const playerInfo = {
                id: message.author.id,
                name: message.author.username,
                titles: message.member.roles.valueOf().map(role => role.id)
            };

            getPlayerAttributes(playerInfo, message);
        } catch (error) {
            logError(error, 'command -> bestiary');
        }
    }
};
