import { TextChannel } from 'discord.js';
import { Fighter, Monster, Player, PlayerInfo } from '../interfaces';
import { getMonster, spawnMonster } from '../monsters/spawner';
import { getPlayer, storePlayer } from './player';
import { multiply, divide, getRandom, roundDown } from '../tools/math';
import { getBuffs } from './result';
import { logError } from '../tools/logger';

const DAMAGE_CONTROL = 200;
const MISS_CHANCE = 21;
const DOUBLE_CHANCE = 80;
const MAX_LUCK = 100;

const getBoost = (attribute: number) => {
    const boost = getRandom();

    if (boost < MISS_CHANCE) {
        return 0;
    } else if (boost > DOUBLE_CHANCE) {
        return multiply(attribute);
    }

    return attribute;
};

const calcDamage = (damage: number, defense: number) => {
    const nerf = DAMAGE_CONTROL + defense;
    const control = DAMAGE_CONTROL / nerf;
    const finalDamage = damage * control;

    return roundDown(finalDamage);
};

const checkAttack = (attacker: Fighter, defender: Fighter, summary: string[]) => {
    if (!attacker.boost) {
        summary.push(`**${attacker.name}** missed!`);
    } else if (!defender.damage) {
        summary.push(`**${defender.name}** defended!`);
    } else {
        defender.health = roundDown(defender.health - defender.damage);

        summary.push(
            `**${attacker.name}** attacks! *${defender.damage}* damage! **${defender.name}** has *${defender.health}* health.`
        );
    }
};

const checkDefense = (attacker: Fighter, defender: Fighter, summary: string[]) => {
    const attackerLuckDraw = getRandom(MAX_LUCK, attacker.luck);
    const defenderLuckDraw = getRandom(MAX_LUCK, defender.luck);
    const divider = divide(MAX_LUCK);

    if (defenderLuckDraw >= divider) {
        attacker.health = roundDown(attacker.health - defender.attack);

        summary.push(
            `**${defender.name}** counters! *${defender.attack}* damage! **${attacker.name}** has *${attacker.health}* health.`
        );
    } else if (attacker.boost && attackerLuckDraw >= divider) {
        summary.push(`**${attacker.name}** follows through!`);

        return { boutWinner: attacker, boutLoser: defender, summary: summary.join('\n') };
    }

    return { boutWinner: defender, boutLoser: attacker, summary: summary.join('\n') };
};

const playRound = (attacker: Fighter, defender: Fighter) => {
    const summary: string[] = [];

    attacker.boost = getBoost(attacker.attack);
    defender.boost = getBoost(defender.defense);
    defender.damage = calcDamage(attacker.boost, defender.boost);

    checkAttack(attacker, defender, summary);

    if (defender.health <= 0) {
        return { boutWinner: attacker, boutLoser: defender, summary: summary.join('\n') };
    }

    return checkDefense(attacker, defender, summary);
};

const startRounds = (player: Player, monster: Monster, channel: TextChannel) => {
    let attacker: Fighter = Object.assign({}, player);
    let defender: Fighter = Object.assign({}, monster);
    let winner: Fighter = attacker;

    while (attacker.health > 0 && defender.health > 0) {
        const { boutLoser, boutWinner, summary } = playRound(attacker, defender);

        attacker = boutWinner;
        defender = boutLoser;

        winner = boutWinner
        channel.send(summary);
    }

    if (winner.id === player.id) {
        player.wins += 1;
        getBuffs(player, monster, channel);
    } else {
        player.losses += 1;
        channel.send(`${player.name} lost!`);
    }

    storePlayer(player);
    spawnMonster(channel);
};

export const battle = async (channel: TextChannel, playerInfo: PlayerInfo) => {
    try {
        const monster = getMonster();
        const player = await getPlayer(playerInfo);

        if (!monster || !player) return;

        startRounds(player, monster, channel);
    } catch (error) {
        logError(error, 'battle');
    }
};
