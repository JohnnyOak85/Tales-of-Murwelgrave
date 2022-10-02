import { Message } from "discord.js";
import { getPlayerBestiary } from "../battles/player";
import { logError } from "../tools/logger";

module.exports = {
    name: 'bestiary',
    description: 'Check your bestiary',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member) return;

            const playerInfo = {
                id: message.author.id,
                name: message.author.username,
                titles: message.member.roles.valueOf().map(role => role.id)
            }

            getPlayerBestiary(playerInfo, message);
        } catch(error) {
            logError(error, 'command -> stats');
        }
    }
}