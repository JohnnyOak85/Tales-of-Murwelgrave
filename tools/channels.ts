import { GuildChannelManager } from 'discord.js';

export const getChannels = async (channels: GuildChannelManager) =>
  channels
    .fetch()
    .then((l) => [...l.values()].filter((c) => c.type === 'GUILD_TEXT'));
