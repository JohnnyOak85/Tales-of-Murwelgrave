import { ChannelType, Message } from 'discord.js';
import { ARENA_CHANNEL } from '../config';
import { acceptChallenge } from '../helpers/arena';
import { logError } from '../tools/logger';

module.exports = {
    name: 'accept',
    description: `Accept a challenge another user issued.`,
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (
                message.channel.type !== ChannelType.GuildText ||
                message.channel.id !== ARENA_CHANNEL
            )
                return;

            acceptChallenge(message.channel, message.author.id);
        } catch (error) {
            logError(error);
        }
    }
};
