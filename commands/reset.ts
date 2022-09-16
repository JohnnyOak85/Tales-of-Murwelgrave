import { Message } from 'discord.js';
import { GAME_MANAGER } from '../config';
import { resetPlayer } from '../helpers/player';
import { logError } from '../tools/logger';

module.exports = {
    name: 'reset',
    description: `Reset a player's stats!`,
    usage: '<user>',
    manager: true,
    execute: async (message: Message) => {
        try {
            const mentions = [...(message.mentions.members?.values() || [])];

            // Abstract code.

            const roles = [...(message.member?.roles.valueOf().entries() || [])].filter(
                role => role[1].name === GAME_MANAGER
            );

            if (!roles.length) return;

            if (!mentions.length) return;

            resetPlayer(message.guild?.id || '', mentions[0].id);

            message.reply(`<@${mentions[0].id}>'s stats have been reset!`);
        } catch (error) {
            logError(error);
        }
    }
};
