import { Client } from 'discord.js';
import { TOKEN } from './config';
import { checkIncomingMessage } from './helpers/message';
import { start } from './tools/guild';
import { logError } from './tools/logger';
import { recordChanges } from './tools/member';

const bot = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'GuildMembers', 'MessageContent']
});

bot.login(TOKEN);

bot.on('ready', () => start([...bot.guilds.cache.values()]));
bot.on('messageCreate', async message => checkIncomingMessage(message));
bot.on('guildMemberUpdate', (a, member) => {
    recordChanges(member);
});

bot.on('error', error => {
    logError(error);
});
