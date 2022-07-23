import { GuildMember, TextChannel } from 'discord.js';
import { LUCK_CAP, STAT_CAP } from '../configurations/main.config';
import { getBool, getRandom } from '../tools/utils';
import { Duelist, Player } from './interfaces';
import { checkBoss, levelUp } from './rank';
import { recordPlayer } from './save';

const isLucky = (player: Player, adversary: Duelist) => player.level + player.attack + player.defense <
  adversary.level + adversary.attack + adversary.defense &&
  player.luck < LUCK_CAP;

const boostLuck = (player: Player, adversary: Duelist) => {
  if (!isLucky(player, adversary)) {
    return '';
  }

  player.luck += 1;

  return `**+1 luck.**`;
};

const splitExp = (attacker: boolean, experience: number) => {
  const split = getRandom(experience);
  const bigSplit = attacker ? split > Math.max(1, experience / 2) : split > experience / 2;

  return {
    attackBoost: attacker
      ? bigSplit ? split : Math.max(1, experience - split)
      : bigSplit ? Math.max(1, experience - split) : split,
    defenseBoost: attacker
      ? bigSplit ? Math.max(1, experience - split) : split
      : bigSplit ? split : Math.max(1, experience - split)
  }
}

const boostStat = (player: Player, stat: 'attack' | 'defense', boost: number) => {
  if (player[stat] >= STAT_CAP) {
    return '';
  }

  player[stat] += boost;

  return `**+${boost} ${stat}.**`;

}

const deBuffStat = (player: Player, stat: 'attack' | 'defense') => {
  const deBuff = getBool() ? 1 : 2;

  if (player[stat] <= STAT_CAP) {
    return ''
  }

  player[stat] -= deBuff;

  return `**-${deBuff} ${stat}.**`
}

const checkMonster = (player: Player, adversary: Duelist, member: GuildMember | undefined) => {
  if ((!adversary.id.includes('_')
    || !isNaN(parseInt(adversary.id, 10))
    && player.bestiary.includes(adversary.name)
  )) {
    return ''
  }

  player.bestiary.push(adversary.name);

  return checkBoss(member, adversary.name)
}

export const getBuffs = (
  player: Player,
  experience: number,
  attacker: boolean,
  adversary: Duelist,
  channel: TextChannel
) => {
  if (player.id.includes('_') || isNaN(parseInt(player.id, 10))) return;

  const reply = [`**${player.name}** wins!`];
  const { attackBoost, defenseBoost } = splitExp(attacker, experience);

  reply.push(boostStat(player, 'attack', attackBoost));
  reply.push(boostStat(player, 'defense', defenseBoost));
  reply.push(boostLuck(player, adversary));
  reply.push(checkMonster(player, adversary, channel.guild.members.cache.find((members) => members.id === player.id)))

  levelUp(player, channel, player.attack + player.defense, reply);
};

export const getDeBuffs = (player: Player, channel: TextChannel) => {
  const reply = [`**${player.name} lost!**`];

  reply.push(deBuffStat(player, 'attack'));
  reply.push(deBuffStat(player, 'defense'));

  channel.send(reply.filter(x => x).join('\n'));

  recordPlayer(player, channel.guild.id, false);
};
