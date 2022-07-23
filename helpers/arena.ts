import { TextChannel } from 'discord.js';
import { buildEmbed } from '../tools/embed';
import { getBool } from '../tools/utils';
import { addBattle } from './battle';
import { startRounds } from './duel';
import { addDuel, cleanUpDuel, getDuel, isValid } from './duels.collector';
import { ensurePlayer } from './player';

export const acceptChallenge = async (
  channel: TextChannel,
  defenderId: string
) => {
  try {
    const duel = getDuel(defenderId);

    if (!duel) {
      channel.send(`<@${defenderId}> there are no open challenges for you.`);
      return;
    }

    addBattle(duel.challenger, defenderId);

    const heads = getBool();
    const attacker = await ensurePlayer(channel.guild.id, heads ? duel.challenger : defenderId);
    const defender = await ensurePlayer(channel.guild.id, heads ? defenderId : duel.challenger);

    if (!attacker || !defender) return;

    startRounds(attacker, defender, channel);

    cleanUpDuel(defenderId);
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const issueChallenge = async (channel: TextChannel, challenger: string, defender: string) => {
  try {
    const res = isValid(challenger, defender);

    if (res) {
      channel.send(res)
      return;
    }

    channel.send({
      embeds: [
        buildEmbed({
          color: '#ff2050',
          description: `<@${challenger}> has challenged <@${defender}>!`,
          title: '**CHALLENGE ISSUED**',
        }),
      ],
    });

    addDuel(channel, challenger, defender);
  } catch (error) {
    throw error;
  }
};
