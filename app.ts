import { Client } from 'discord.js';
import { logError } from './tools/logger';
import { readEnvironment } from './storage/environment';
import { start } from './start';
import { executeCommand } from './tools/commands';

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'GuildMembers', 'MessageContent']
});

readEnvironment();

client.login(process.env.TOKEN);

client.on('ready', async () =>{
    const guild = await client.guilds.fetch(process.env.GUILD_ID || '');

    if (!guild) {
        logError('NO GUILD', 'on-ready')
    }
    
    start(guild);
});

client.on('messageCreate', message => {
    executeCommand(message);
})

client.on('guildMemberAdd', async member => {
    const role = await member.guild.roles.fetch(process.env.PLAYER_ROLE_ID || '');

    if (!role) {
        logError('NO ROLE', 'on-guildMemberAdd');
        return;
    }

    member.roles.add(role);
})

client.on('error', error => {
    logError(error, 'client');
});
