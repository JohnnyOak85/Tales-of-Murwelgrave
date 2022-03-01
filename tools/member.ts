import { GuildMember } from 'discord.js';

const list = [''];

const filterRoles = (member: GuildMember) => [
  ...member.roles.cache.filter((r) => list.includes(r.name)).values(),
];

export const recordMembers = (members: GuildMember[]) => {
  for (const member of members) {
    if (filterRoles(member).length) {
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
        name: member.nickname,
        wins: 0,
      };
    }
  }
};
