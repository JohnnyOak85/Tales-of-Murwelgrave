import { GuildMember, Role } from 'discord.js';
import { DataList } from '../helpers/interfaces';
import { getDoc } from './database';

const getName = (roles: Role[], list: string[]) =>
  roles.find((r) => list.includes(r.name.toLowerCase()))?.name.toLowerCase() ||
  '';

export const getRanks = () => getDoc<DataList>('', 'ranks');
export const findRank = (roles: Role[]) =>
  getRanks().then((l) => l[getName(roles, Object.keys(l))]);

export const addRole = async (
  roles: Role[],
  members: GuildMember[],
  roleName: string,
  memberId: string
) => {
  const role = roles.find((r) =>
    r.name.toLowerCase().includes(roleName.toLowerCase())
  );
  const member = members.find((m) => m.id === memberId);

  if (!roleName || !role || !member) return;

  member.roles.add(role);
};

export const bulkRemoveRoles = (
  member: GuildMember,
  roles: Role[],
  list: string[]
) => {
  for (const roleId of list) {
    const role = roles.find((r) => r.name.toLowerCase() === roleId);

    if (!role || !member.roles.cache.find((r) => r === role)) continue;

    member.roles.remove(role);
  }
};
