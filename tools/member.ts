import { GuildMember, GuildMemberManager } from 'discord.js';
import { GAME_ROLES } from '../config';
import { docExists, saveDoc } from './database';

const filterRoles = (member: GuildMember) =>
  member.roles.cache.filter((r) => GAME_ROLES.includes(r.id)).values();

const getList = (manager: GuildMemberManager) =>
  manager.fetch().then((l) => [...l.values()]);

const filterMembers = (manager: GuildMemberManager) =>
  getList(manager).then((l) => l.filter((m) => hasRoles(m)));

const recordPlayer = async (member: GuildMember) => {
  if (await docExists(member.guild.id, member.id)) return;

  const player = {
    attack: 15,
    bestiary: [],
    defense: 15,
    id: member.id,
    health: 100,
    level: 1,
    losses: 0,
    luck: 1,
    messages: 0,
    name: member.user.username,
    wins: 0,
  };

  saveDoc(player, member.guild.id, member.id);
};

export const hasRoles = (member: GuildMember) =>
  !![...filterRoles(member)].length;

export const recordMembers = async (manager: GuildMemberManager) => {
  for (const member of await filterMembers(manager)) {
    recordPlayer(member);
  }
};

export const recordChanges = async (member: GuildMember) => {
  if (!hasRoles(member)) {
    recordPlayer(member);
  }
};
