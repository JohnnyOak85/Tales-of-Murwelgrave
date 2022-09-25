import { Message } from "discord.js";
import { getPlayerStats } from "../battles/player";
import { logError } from "../tools/logger";

module.exports = {
    name: 'stats',
    description: 'Check your stats',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            message.channel.send(getPlayerStats(message.author.id, message.author.username))
        } catch(error) {
            logError(error, 'command -> stats');
        }
    }
}