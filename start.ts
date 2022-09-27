import { readEnvironment } from './storage/environment';
import { logError, logInfo } from './tools/logger';
import { setupGame } from './storage/database';
import { spawnMonster } from './monsters/spawner';
import { ChannelType, Guild } from 'discord.js';
import { setCommands } from './tools/commands';

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

export const start = async (guild: Guild) => {
    try {
        const channel = await getChannel(guild);

        if (!channel) {
            logError('NO CHANNEL FOUND', 'start');
            return;
        }

        setCommands()
        setupGame();
        spawnMonster(channel);

        logInfo('Game is ready.');
    } catch (error) {
        logError(error, 'start');
    }
};
