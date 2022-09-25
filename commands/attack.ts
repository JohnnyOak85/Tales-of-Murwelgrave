import { ChannelType, Message } from 'discord.js';
import { battle } from '../battles/battle';
import { logError } from '../tools/logger';

module.exports = {
    name: 'attack',
    description: `Attack a spawned monster!`,
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (message.channel.type !== ChannelType.GuildText || !message.member) return;

            battle(message.channel, message.member.id);
        } catch (error) {
            logError(error, 'command -> attack');
        }
    }
};
