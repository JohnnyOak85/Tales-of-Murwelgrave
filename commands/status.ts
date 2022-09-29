import { ChannelType, Message } from "discord.js";
import { logError } from "../tools/logger";
import { getStatus } from "../tools/status";

module.exports = {
    name: 'status',
    description: 'Check the game status',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member?.permissions.has("Administrator") || message.channel.type !== ChannelType.GuildText) return;

            getStatus(message.channel);
        } catch(error) {
            logError(error, 'command -> toggle');
        }
    }
}