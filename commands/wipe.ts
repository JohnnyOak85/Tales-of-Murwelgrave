import { ChannelType, Message } from 'discord.js';
import { logError } from '../tools/logger';

module.exports = {
    name: 'wipe',
    description: 'Wipe all channel messages',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (
                !message.member?.permissions.has('Administrator') ||
                message.channel.type !== ChannelType.GuildText
            )
                return;

            let messages;

            do {
                messages = await message.channel.messages.fetch();
                message.channel.bulkDelete(messages);
            } while (messages.size >= 2);
        } catch (error) {
            logError(error, 'command -> wipe');
        }
    }
};
