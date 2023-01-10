import { Message } from 'discord.js';
import { getScoreBoard } from '../battles/player';
import { logError } from '../tools/logger';

module.exports = {
    name: 'score',
    description: 'Check the score board',
    usage: ' ',
    execute: async (message: Message) => {
        try {
            if (!message.member) return;

            getScoreBoard(message);
        } catch (error) {
            logError(error, 'command -> score');
        }
    }
};
