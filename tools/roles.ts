import { GuildMember, RoleManager } from 'discord.js';
import { GAME_AREAS, LOWEST_ROLE } from '../config';
import { ROLES } from '../configurations/rank.config';
import { updateChannels } from './channels';

const getRoles = async (m: RoleManager) => (await m.fetch()).map(x => x);

export const findRole = async (m: RoleManager, name: string) =>
    (await getRoles(m)).find(r => r.name.toLowerCase().includes(name.toLowerCase()));

export const addRoles = async (member: GuildMember, roles: string[]) => {
    for (const name of roles) {
        const role = await findRole(member.guild.roles, name);

        if (!role) continue;

        member.roles.add(role);
    }
};

export const removeRoles = async (member: GuildMember, roles: string[]) => {
    for (const name of roles) {
        const role = await findRole(member.guild.roles, name);

        if (!role) continue;

        member.roles.remove(role);
    }
};

export const createRoles = async (manager: RoleManager) => {
    const roles = await getRoles(manager);

    for (const name of ROLES) {
        if (roles.find(r => r.name === name)) continue;

        const role = await manager.create({
            name,
            position: ROLES.indexOf(name) + 1 + LOWEST_ROLE
        });

        updateChannels(manager.guild.channels, GAME_AREAS, role.id);
    }
    manager.create();
};
