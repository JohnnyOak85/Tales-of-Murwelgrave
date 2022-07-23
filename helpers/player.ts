import { TextChannel } from 'discord.js';
import { BASE_HEALTH, BASE_STAT, DEFAULT_NAME } from '../configurations/main.config';
import { findDoc, saveDoc } from '../tools/database';
import { getRandom } from '../tools/utils';
import { Duelist, Player } from './interfaces';
import { getBuffs, getDeBuffs } from './results';

export const getPlayerStats = async (guild: string, user: string) => {
  const player = await ensurePlayer(guild, user);

  return `\nLevel: ${player.level}\nHealth: ${player.health}\nAttack: ${player.attack}\nDefense: ${player.defense}\nLuck: ${player.luck}\nWins: ${player.wins}\nLosses: ${player.losses}`;
};

export const ensurePlayer = async (guild: string, user: string): Promise<Player> => {
  const player = await findDoc<Player>(guild, user);

  return {
    attack: player?.attack || BASE_STAT,
    bestiary: player?.bestiary || [],
    defense: player?.defense || BASE_STAT,
    health: player?.health || BASE_HEALTH,
    id: player?.id || '',
    level: player?.level || 1,
    losses: player?.losses || 0,
    luck: player?.luck || 1,
    messages: player?.messages || 0,
    name: player?.name || DEFAULT_NAME,
    wins: player?.wins || 0
  };
};

export const getResults = async (
  attacker: Duelist,
  defender: Duelist,
  channel: TextChannel
) => {
  const winner = defender.health > 0 ? defender : attacker;
  const loser = defender.health > 0 ? attacker : defender;
  const experience = Math.max(1, Math.floor((loser.level * 3) / winner.level));

  if (!winner.id.includes('_') && !isNaN(parseInt(winner.id, 10))) {
    getBuffs(winner as Player, experience, winner === attacker, loser, channel);
  }

  if (getRandom() < 6 && !loser.id.includes('_') && !isNaN(parseInt(loser.id, 10))) {
    getDeBuffs(loser as Player, channel);
  }
};

export const resetPlayer = async (guild: string, user: string) => {
  const player = await ensurePlayer(guild, user);

  if (!player) return;

  player.attack = BASE_STAT;
  player.bestiary = [];
  player.defense = BASE_STAT;
  player.health = BASE_HEALTH;
  player.level = 1;
  player.losses = 0;
  player.luck = 1;
  player.messages = 0;
  player.wins = 0;

  saveDoc(player, guild, user);
};
