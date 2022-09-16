import { GuildChannelManager, TextChannel } from 'discord.js';
import { getAreaNames } from '../storage/database';
import { spawnMonster } from './monster';

const getAreaChannels = async (manager: GuildChannelManager) => {
    const channels = [...(await manager.fetch()).values()];
    const areas = await getAreaNames();

    return channels.filter(channel => areas.includes(channel.name));
};

export const startAreas = async (manager: GuildChannelManager) => {
    const areas = await getAreaChannels(manager);

    for (const area of areas) {
        spawnMonster(area as TextChannel); // TODO review
    }
};
