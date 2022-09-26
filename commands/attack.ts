import { ChannelType, Message } from 'discord.js';
import { battle } from '../battles/battle';
import { getMap } from '../storage/cache';
import { logError } from '../tools/logger';
import { getRandom } from '../tools/math';

module.exports = {
    name: 'attack',
    description: `Attack a spawned monster!`,
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (message.channel.type !== ChannelType.GuildText || !message.member) return;

            const playerInfo = {
                id: message.author.id,
                name: message.author.username,
                titles: message.member.roles.valueOf().map(role => role.id)
            }
            
            battle(message.channel, playerInfo);
        } catch (error) {
            logError(error, 'command -> attack');
        }
    }
};
