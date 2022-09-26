import { ChannelType, Message } from "discord.js";
import { logError } from "../tools/logger";

module.exports = {
    name: 'wipe',
    description: 'Wipe all channel messages',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member?.permissions.has("Administrator") || message.channel.type !== ChannelType.GuildText) return;

            const messages = await message.channel.messages.fetch();
            message.channel.bulkDelete(messages);
        } catch(error) {
            logError(error, 'command -> wipe');
        }
    }
}