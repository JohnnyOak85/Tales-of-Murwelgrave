import { GuildMember, GuildMemberManager } from 'discord.js';
import { intersection } from 'lodash';
import { BASE_HEALTH, BASE_STAT } from '../configurations/main.config';
import { ROLES } from '../configurations/rank.config';
import { docExists, saveDoc } from './database';

const getUserRoles = (member: GuildMember) => [...member.roles.cache.filter(role => !!role).values()];
const getUserRoleNames = (member: GuildMember) => getUserRoles(member).map(role => role.name.toLowerCase());
const getRoleNames = () => ROLES.map(role => role.toLowerCase())

const getList = (manager: GuildMemberManager) =>
  manager.fetch().then((members) => [...members.values()]);

const filterMembers = (manager: GuildMemberManager) =>
  getList(manager).then((members) => members.filter((member) => hasRoles(member)));

const recordPlayerDoc = async (member: GuildMember) => {
  if (await docExists(member.guild.id, member.id)) return;

  const player = {
    attack: BASE_STAT,
    bestiary: [],
    defense: BASE_STAT,
    id: member.id,
    health: BASE_HEALTH,
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
  !!intersection(getUserRoleNames(member), getRoleNames()).length

export const recordMembers = async (manager: GuildMemberManager) => {
  for (const member of await filterMembers(manager)) {
    recordPlayerDoc(member);
  }
};

export const recordChanges = async (member: GuildMember) => {
  if (!hasRoles(member)) {
    recordPlayerDoc(member);
  }
};
