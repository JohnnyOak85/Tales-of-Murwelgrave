import { GuildBasedChannel, TextChannel } from 'discord.js';
import { listDocs } from '../tools/database';
import { spawnMonster } from './monster';

export const startAreas = async (channels: GuildBasedChannel[]) => {
  const areas = await listDocs('game/areas');

  for (const name of areas) {
    const area = channels.find(
      (channel) => channel.name === name && channel.type === 'GUILD_TEXT'
    );

    if (!area) continue;

    spawnMonster(area as TextChannel);
  }
};
