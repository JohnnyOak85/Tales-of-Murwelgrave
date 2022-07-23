import { GuildMember, TextChannel } from 'discord.js';
import { buildEmbed } from '../tools/embed';
import { addRoles, removeRoles } from '../tools/roles';
import { getRandom, increment } from '../tools/utils';
import { Player } from './interfaces';
import { recordPlayer } from './save';
import { intersection } from 'lodash';
import { BOSSES } from '../configurations/monster.config';
import { RANKS } from '../configurations/rank.config';
import { HEALTH_CAP, LEVEL_CONTROL } from '../configurations/main.config';
import { ensurePlayer } from './player';

const rankUp = async (member: GuildMember) => {
  const currentRanks = intersection(Object.keys(RANKS), member.roles.cache.map(r => r.name.toLowerCase()));
  const upgrade = RANKS[currentRanks[getRandom(currentRanks.length - 1, 0)]];

  if (!upgrade || !member) {
    return '';
  }

  addRoles(member, [upgrade]);
  removeRoles(member, currentRanks);

  return `**Rank up! -> ${upgrade}!**`;
};

export const levelUp = async (
  winner: Player,
  channel: TextChannel,
  incrControl: number,
  reply: string[]
) => {
  const currentLevel = winner.level;

  if (!reply || currentLevel >= LEVEL_CONTROL) return;

  winner.level = increment(incrControl, winner.level);

  if (winner.level > currentLevel) {
    const gain = getRandom(winner.level * 4, winner.level * 3);
    const { health } = await ensurePlayer(channel.guild.id, winner.id);
    const description = [`<@${winner.id}>`, `**${currentLevel} -> ${winner.level}**`].concat(reply);

    if (winner.health < HEALTH_CAP) {
      winner.health = (health || 100) + gain;

      description.push(`**+${gain} health.**`)
    }

    const member = channel.guild.members.cache.find((m) => m.id === winner.id);

    if (member && winner.level !== LEVEL_CONTROL) {
      description.push(await rankUp(member))
    }

    channel.send({
      embeds: [
        buildEmbed({
          description: description.filter(x => x).join('\n'),
          title: 'Level up!',
        }),
      ],
    });
  } else {
    channel.send(reply.filter(x => x).join('\n'));
  }

  recordPlayer(winner, channel.guild.id, true);
};

export const checkBoss = (member: GuildMember | undefined, boss: string) => {
  if (member && BOSSES.find((b) => boss.toLowerCase().includes(b.toLowerCase()))) {
    addRoles(member, [boss.toLowerCase()])

    return `You just defeated the **${boss}**! Congratulations!`
  }

  return '';
};
