import { GuildChannelManager, TextChannel } from 'discord.js';
import { listDocs } from '../tools/database';
import { spawnMonster } from './monster';

const getChannels = async (manager: GuildChannelManager) =>
  manager
    .fetch()
    .then((l) => [...l.values()].filter((c) => c.type === 'GUILD_TEXT'));

const getAreas = async (manager: GuildChannelManager) =>
  listDocs('areas').then((l) =>
    getChannels(manager).then((c) => c.filter((c) => l.includes(c.name)))
  );

export const startAreas = async (manager: GuildChannelManager) => {
  for (const area of await getAreas(manager)) {
    spawnMonster(area as TextChannel);
  }
};
