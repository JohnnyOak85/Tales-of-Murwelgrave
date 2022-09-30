import { logError, logInfo } from './tools/logger';
import { setupGame } from './storage/database';
import { spawnMonster, stopSpawner } from './monsters/spawner';
import { ChannelType, Guild } from 'discord.js';
import { setCommands } from './tools/commands';
import { startCache, deleteValue, getValue, saveValue } from './storage/cache';

const getChannel = async (guild: Guild) => {
    if (!process.env.CHANNEL_ID) {
        logError('GAME CHANNEL ID NOT SET', 'getChannel');
        return;
    }

    const channel = await guild.channels.fetch(process.env.CHANNEL_ID);

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

        console.log('Ready.');
        logInfo('Ready.');
    } catch (error) {
        logError(error, 'start');
    }
};

export const startGame = async (guild: Guild) => {
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
        logError(error, 'startGame');
    }
}