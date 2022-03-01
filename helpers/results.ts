import { TextChannel } from 'discord.js';
import { getBool, getRandom } from '../tools/utils';
import { Duelist } from './interfaces';
import { checkBoss, levelUp } from './rank';
import { recordLoser } from './save';

const getLuckBoost = (player: Duelist, reply: string) => {
  player.luck = player.luck + 1;
  reply = `${reply} +1 luck.`;

  return reply;
};

export const getBuffs = (
  player: Duelist,
  experience: number,
  attacker: boolean,
  adversary: Duelist,
  channel: TextChannel
) => {
  if (player.id.includes('_') || isNaN(parseInt(player.id, 10))) return;

  const split = getRandom(experience);
  let reply = `**${player.name}** wins!`;
  let attackBoost = 0;
  let defenseBoost = 0;

  if (attacker) {
    const bigSplit = split > Math.max(1, experience / 2);

    attackBoost = bigSplit ? split : Math.max(1, experience - split);
    defenseBoost = bigSplit ? Math.max(1, experience - split) : split;
  } else {
    const bigSplit = split > experience / 2;

    attackBoost = bigSplit ? Math.max(1, experience - split) : split;
    defenseBoost = bigSplit ? split : Math.max(1, experience - split);
  }

  player.attack = player.attack + attackBoost;
  player.defense = player.defense + defenseBoost;

  reply = `${reply}\n**+${attackBoost} attack. +${defenseBoost} defense.`;

  if (
    player.level + player.attack + player.defense <
    adversary.level + adversary.attack + adversary.defense
  ) {
    reply = getLuckBoost(player, reply);
  }

  reply = checkBoss(
    player,
    adversary.name,
    [...channel.guild.roles.cache.values()],
    [...channel.guild.members.cache.values()],
    reply
  );

  if (!player.bestiary.includes(adversary.name)) {
    player.bestiary.push(adversary.name);
  }

  levelUp(player, channel, reply);
};

export const getDeBuffs = (player: Duelist, channel: TextChannel) => {
  if (player.id.includes('_') || isNaN(parseInt(player.id, 10))) return;

  let deBuffs = '';

  const attackDeBuff = getBool() ? 1 : 2;
  const defenseDeBuff = getBool() ? 1 : 2;

  player.attack = player.attack - attackDeBuff;
  player.defense = player.defense - defenseDeBuff;

  if (player.attack <= 15) {
    player.attack = 15;
  } else {
    deBuffs = `${deBuffs}-${attackDeBuff} attack.`;
  }

  if (player.defense <= 15) {
    player.defense = 15;
  } else {
    deBuffs = `${deBuffs} -${defenseDeBuff} defense.`;
  }

  channel.send(`**${player.name}** lost!${deBuffs ? `\n**${deBuffs}**` : ''}`);

  recordLoser(player, channel.guild.id);
};
