import { logError } from './tools/logger';
import { setupGame } from './storage/database';
import { spawnMonster, stopSpawner } from './monsters/spawner';
import { ChannelType, Guild } from 'discord.js';
import { setCommands } from './tools/commands';
import { startCache, deleteValue, getValue, saveValue } from './storage/cache';
import { CHANNEL_ID } from './config';

const getChannel = async (guild: Guild) => {
    const channel = await guild.channels.fetch(CHANNEL_ID);

    if (!channel?.isTextBased() || channel.type !== ChannelType.GuildText) {
        logError('WRONG CHANNEL TYPE', 'getChannel');
        return;
    }

    return channel;
};

export const start = async () => {
    try {
        setCommands();
        startCache();
        deleteValue('is-running');
        
        console.log('Ready.');
    } catch (error) {
        logError(error, 'start');
    }
};

export const toggleGame = async (guild: Guild) => {
    const key = 'is-running';

    try {
        const isRunning = await getValue(key);
        const channel = await getChannel(guild);
        
        if (!channel) {
            logError('NO CHANNEL FOUND', 'start');
            return;
        }

        if (!isRunning) {
            channel.send('Starting the game.');

            setupGame();
            spawnMonster(channel);
            
            saveValue(key, 'true');
        } else {
            channel.send('Ending the game');
            
            stopSpawner();
            deleteValue(key);
        }
    } catch(error) {
        logError(error, 'toggleGame');
    }
}