import { GuildMember, Role, TextChannel } from 'discord.js';
import { BOSSES } from '../config';
import { findDoc } from '../tools/database';
import { buildEmbed } from '../tools/embed';
import { addRole, bulkRemoveRoles, findRank, getRanks } from '../tools/roles';
import { getRandom, increment } from '../tools/utils';
import { Duelist } from './interfaces';
import { recordWinner } from './save';

const rankUp = async (member: GuildMember, level: number) => {
  if (level !== 40 && level !== 20) return;

  const name = await findRank([...member?.roles.cache.values()]);
  const upgrade = member?.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === name
  );

  if (!upgrade || !member) return;

  addRole([upgrade], [member], upgrade?.name, member?.id);

  const toRemove = member.guild.roles.cache.filter((r) => r !== upgrade);

  bulkRemoveRoles(
    member,
    [...toRemove.values()],
    Object.keys(await getRanks())
  );

  return upgrade.name;
};

export const levelUp = async (
  winner: Duelist,
  channel: TextChannel,
  incrControl: number,
  reply: string
) => {
  const currentLevel = winner.level;

  if (!reply || currentLevel >= 50) return;

  winner.level = increment(incrControl, winner.level);

  if (winner.level > currentLevel) {
    const gain = getRandom(winner.level * 4, winner.level);
    const doc = await findDoc<Duelist>(channel.guild.id, winner.id);

    winner.health = (doc?.health || 100) + gain;

    reply = `<@${winner.id}>\n**${currentLevel} -> ${winner.level}**\n${reply} +${gain} health.**`;

    const member = channel.guild.members.cache.find((m) => m.id === winner.id);

    if (member) {
      const rank = await rankUp(member, winner.level);

      if (rank) {
        reply = `${reply}\n**Rank up! -> ${rank}!**`;
      }
    }

    channel.send({
      embeds: [
        buildEmbed({
          description: reply,
          title: 'Level up!',
        }),
      ],
    });
  } else {
    channel.send(`${reply}**`);
  }

  recordWinner(winner, channel.guild.id);
};

export const checkBoss = (
  player: Duelist,
  adversary: string,
  roles: Role[],
  member: GuildMember[],
  reply: string
) => {
  if (
    BOSSES.find((b) => adversary.toLowerCase().includes(b)) &&
    !player.bestiary.includes(adversary)
  ) {
    addRole(roles, member, adversary.toLowerCase(), player.id);

    return `${reply}\nYou just defeated **${adversary}**! Congratulations!`;
  } else {
    return reply;
  }
};
