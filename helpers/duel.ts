import { TextChannel } from 'discord.js';
import { Duelist } from './interfaces';
import { getRandom } from '../tools/utils';
import { getResults } from './player';
import { DAMAGE_CONTROL } from '../configurations/main.config';
import { deleteBattle } from './battle';

const getBoost = (attribute: number, boost: number) => {
  if (boost < 21) {
    return 0;
  } else if (boost > 80) {
    return attribute * 2;
  }

  return attribute;
};

const battle = (attacker: Duelist, defender: Duelist, channel: TextChannel) => {
  try {
    const damageBoost = getBoost(attacker.attack, getRandom());
    const defenseBoost = getBoost(defender.defense, getRandom());
    const damage = Math.floor(
      Math.max(
        0,
        damageBoost * (DAMAGE_CONTROL / (DAMAGE_CONTROL + defenseBoost))
      )
    );
    const summary = [];

    if (!damageBoost) {
      summary.push(`**${attacker.name}** missed!`);
    } else if (!damage) {
      summary.push(`**${defender.name}** defended!`);
    } else {
      defender.health = Math.max(0, defender.health - damage);

      summary.push(
        `**${attacker.name}** attacks! *${damage}* damage! **${defender.name}** has *${defender.health}* health.`
      );
    }

    if (defender.health <= 0) {
      channel.send(summary.join('\n'));

      return { boutWinner: defender, boutLoser: attacker };
    }

    if (getRandom(defender.luck) >= 50) {
      attacker.health = Math.max(0, attacker.health - defender.attack);

      summary.push(
        `**${defender.name}** counters! *${defender.attack}* damage! **${attacker.name}** has *${attacker.health}* health.`
      );
    } else if (getRandom(attacker.luck) >= 50 && damageBoost) {
      summary.push(`**${attacker.name}** follows through!`);

      channel.send(summary.join('\n'));

      return { boutWinner: attacker, boutLoser: defender };
    }

    channel.send(summary.join('\n'));

    return { boutWinner: defender, boutLoser: attacker };
  } catch (error) {
    throw error;
  }
};

export const startRounds = (
  challenger: Duelist,
  challenged: Duelist,
  channel: TextChannel
) => {
  let attacker = challenger;
  let defender = challenged;

  while (challenged.health > 0 && challenger.health > 0) {
    const { boutLoser, boutWinner } = battle(attacker, defender, channel);

    attacker = boutWinner;
    defender = boutLoser;
  }

  getResults(challenger, challenged, channel);
  deleteBattle(challenger.id);
};
