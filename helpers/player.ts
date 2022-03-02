import { TextChannel } from 'discord.js';
import { BOSSES } from '../config';
import { findDoc, saveDoc } from '../tools/database';
import { addRole } from '../tools/roles';
import { Duelist } from './interfaces';
import { getBuffs, getDeBuffs } from './results';

export const getPlayer = (guild: string, user: string) =>
  findDoc<Duelist>(guild, user);

export const getStats = async (guild: string, user: string) => {
  const player = await findDoc<Duelist>(guild, user);

  return `\nLevel: ${player?.level}\nHealth: ${player?.health}\nAttack: ${player?.attack}\nDefense: ${player?.defense}\nLuck: ${player?.luck}\nWins: ${player?.wins}\nLosses: ${player?.losses}`;
};

export const ensureDuelist = async (guild: string, user: string) => {
  const duelist = await findDoc<Duelist>(guild, user);

  return {
    attack: duelist?.attack || 15,
    bestiary: duelist?.bestiary || [],
    defense: duelist?.defense || 15,
    health: duelist?.health || 100,
    id: duelist?.id || '',
    level: duelist?.level || 1,
    luck: duelist?.luck || 1,
    name: duelist?.name || 'Duelist',
  };
};

export const getResults = async (
  attacker: Duelist,
  defender: Duelist,
  channel: TextChannel
) => {
  const winner = defender.health > 0 ? defender : attacker;
  const loser = defender.health > 0 ? attacker : defender;
  const experience = Math.max(1, Math.floor((loser.level * 2) / winner.level));

  addRole(
    [...channel.guild.roles.cache.values()],
    [...channel.guild.members.cache.values()],
    BOSSES.find((b) => loser.id.toLowerCase().includes(b)) || '',
    winner.id
  );

  getBuffs(winner, experience, winner === attacker, loser, channel);
  getDeBuffs(loser, channel);
};

export const resetPlayer = async (guild: string, user: string) => {
  const doc = await findDoc<Duelist>(guild, user);

  if (!doc) return;

  doc.attack = 15;
  doc.defense = 15;
  doc.health = 100;
  doc.level = 1;
  doc.luck = 1;
  doc.losses = 0;
  doc.wins = 0;
  doc.messages = 0;

  saveDoc(doc, guild, user);
};

export const recordPlayers = () => {};
