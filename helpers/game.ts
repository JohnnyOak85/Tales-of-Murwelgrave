import { GuildChannelManager, TextChannel } from 'discord.js';
import { AREAS } from '../configurations/monster.config';
import { spawnMonster } from './monster';

const getChannels = (manager: GuildChannelManager) =>
  manager
    .fetch()
    .then((channels) => [...channels.values()].filter((channel) => channel.type === 'GUILD_TEXT'));


const getAreas = (manager: GuildChannelManager) =>
  getChannels(manager)
    .then((channels) => channels.filter((channel) => Object.keys(AREAS).includes(channel.name)))


export const startAreas = async (manager: GuildChannelManager) => {
  for (const area of await getAreas(manager)) {
    spawnMonster(area as TextChannel);
  }
};
