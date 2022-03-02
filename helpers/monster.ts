import { Message, TextChannel } from 'discord.js';
import { CollectionFactory } from '../tools/collection.factory';
import { Duelist } from './interfaces';
import { ensureDuelist } from './player';
import { getRandom } from '../tools/utils';
import { docExists, getDoc } from '../tools/database';
import { buildEmbed } from '../tools/embed';
import { startRounds } from './duel';

interface Monster extends Duelist {
  thumb: string;
}

const monsters = new CollectionFactory<{
  id: string;
  monster: Duelist;
  timer: NodeJS.Timeout;
}>();

const cleanUpDuel = (name: string) => {
  const timer = monsters.getItem(name)?.timer;

  if (timer) monsters.clearTimer(name, timer);
};

const selectMonster = async (area: string) => {
  const list = await getDoc<Monster[]>('areas', area);
  const chance = getRandom();

  if (chance < 25) {
    return list[0];
  } else if (chance < 55) {
    return list[getRandom(4)];
  } else if (chance < 75) {
    return list[getRandom(6, 5)];
  } else if (chance < 95) {
    return list[getRandom(8, 7)];
  } else {
    return list[9];
  }
};

export const clearMessage = (list: Message[], id: string) => {
  const message = list.find((m) => m.id === id);
  message?.delete();
};

export const spawnMonster = async (channel: TextChannel) => {
  if (!(await docExists('areas', channel.name))) return;

  const timer = setInterval(async () => {
    const monster = await selectMonster(channel.name);
    const embed = buildEmbed({
      color: '#ff2050',
      description: `A ${monster.name} appears!`,
      title: '**MONSTER ATTACK**',
      thumb: monster.thumb,
    });

    clearMessage(
      [...channel.messages.cache.values()],
      monsters.getItem(channel.name)?.id || ''
    );

    const id = (await channel.send({ embeds: [embed] })).id;

    monsters.addItem(channel.name, { monster, timer, id });
  }, 90000);
};

export const engageMonster = async (
  channel: TextChannel,
  challengerId: string
) => {
  const monster = monsters.getItem(channel.name)?.monster;
  const challenger = await ensureDuelist(channel.guild.id, challengerId);

  cleanUpDuel(channel.name);

  if (!monster || !challenger) return;

  monster.luck = monster.luck || 1;

  startRounds(challenger, monster, channel);
  spawnMonster(channel);
};
