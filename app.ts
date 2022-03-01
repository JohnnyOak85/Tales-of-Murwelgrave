import { Client, Intents } from 'discord.js';
import { checkIncomingMessage } from './helpers/message';
import { start } from './tools/guild';
import { logError } from './tools/utils';
import { TOKEN } from './config.json';

const bot = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

bot.login(TOKEN);

bot.on('ready', () => start([...bot.guilds.cache.values()]));
bot.on('message', async (message) => checkIncomingMessage(message));

bot.on('error', (error) => {
  logError(error);
});
