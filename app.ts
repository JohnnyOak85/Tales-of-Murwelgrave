import { Client } from 'discord.js';
import { TOKEN } from './config';
import { checkIncomingMessage } from './helpers/message';
import { start } from './tools/guild';
import { recordChanges } from './tools/member';
import { logError } from './tools/utils';

const bot = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'],
});

bot.login(TOKEN);

bot.on('ready', () => start([...bot.guilds.cache.values()]));
bot.on('messageCreate', async (message) => checkIncomingMessage(message));
bot.on('guildMemberUpdate', (a, member) => recordChanges(member));

bot.on('error', (error) => {
  logError(error);
});
