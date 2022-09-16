import { GuildChannelManager } from 'discord.js';

export const getChannels = async (channels: GuildChannelManager) =>
    channels.fetch().then(l => [...l.values()].filter(c => c.type === 'GUILD_TEXT'));

export const updateChannels = async (
    manager: GuildChannelManager,
    list: string[],
    roleId: string
) => {
    const channels = await getChannels(manager);

    for (const name of list) {
        const channel = channels.find(c => c.name === name);
        channel?.edit({ permissionOverwrites: [{ id: roleId, allow: 'VIEW_CHANNEL' }] });
    }
};
