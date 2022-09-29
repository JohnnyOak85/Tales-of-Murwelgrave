import { ChannelType, Message } from "discord.js";
import { startGame } from "../start";
import { logError } from "../tools/logger";

module.exports = {
    name: 'toggle',
    description: 'Toggle the game on or off',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member?.permissions.has("Administrator") || message.channel.type !== ChannelType.GuildText) return;

            if (!message.guild) return;

            startGame(message.guild);
        } catch(error) {
            logError(error, 'command -> toggle');
        }
    }
}