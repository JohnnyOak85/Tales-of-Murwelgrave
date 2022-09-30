import { Client } from 'discord.js';
import { logError } from './tools/logger';
import { start } from './start';
import { executeCommand } from './tools/commands';
import { PLAYER_ROLE_ID, TOKEN } from './config';

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'GuildPresences', 'GuildMembers', 'MessageContent']
});

client.login(TOKEN);

client.on('ready', async () =>{    
    start();
});

client.on('messageCreate', message => {
    executeCommand(message);
})

client.on('guildMemberAdd', async member => {
    const role = await member.guild.roles.fetch(PLAYER_ROLE_ID || '');

    if (!role) {
        logError('NO ROLE', 'on-guildMemberAdd');
        return;
    }

    member.roles.add(role);
})

client.on('error', error => {
    logError(error, 'client');
});
