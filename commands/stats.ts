import { Message } from "discord.js";
import { logError } from "../tools/logger";

module.exports = {
    name: 'stats',
    description: 'Check your stats',
    usage: ' ',
    execute: async (message: Message) => {
        try {

        } catch(error) {
            logError(error, 'command -> stats');
        }
    }
}