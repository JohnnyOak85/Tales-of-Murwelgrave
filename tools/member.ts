import { GuildMember } from 'discord.js';
import { GAME_ROLES } from '../config';
import { saveDoc } from './database';

export const filterRoles = (member: GuildMember) => [
  ...member.roles.cache.filter((r) => GAME_ROLES.includes(r.id)).values(),
];

export const recordMembers = (members: GuildMember[]) => {
  for (const member of members) {
    if (!filterRoles(member).length) continue;

    saveDoc(
      {
        attack: 15,
        bestiary: [],
        defense: 15,
        id: member.id,
        health: 100,
        level: 1,
        losses: 0,
        luck: 1,
        messages: 0,
        name: member.nickname,
        wins: 0,
      },
      member.guild.id,
      member.id
    );
  }
};
