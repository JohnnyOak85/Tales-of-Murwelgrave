import { TextChannel } from 'discord.js';
import { Fighter, Monster, Player, PlayerInfo } from '../interfaces';
import { getMonster, spawnMonster, toggleBattle } from '../monsters/spawner';
import { getPlayer, storePlayer } from './player';
import { multiply, getRandom, roundDown, getBool } from '../tools/math';
import { getBuffs } from './result';
import { logError } from '../tools/logger';
import { Collector } from '../tools/collector';

const DAMAGE_CONTROL = 200;
const MISS_CHANCE = 21;
const DOUBLE_CHANCE = 80;
const MAX_LUCK = 100;

const fighters = new Collector<Fighter>();

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
        summary.push(`**${attacker.name}** missed...`);
    } else if (!defender.damage) {
        summary.push(`**${defender.name}** defended!`);
    } else {
        const fighter = fighters.getItem(defender.id);
        defender.health = roundDown(defender.health - defender.damage);

        summary.push(
            `**${attacker.name}** attacks! *${defender.damage}* :boom: **${defender.name}** \`${defender.health}/${fighter?.health}\` HP`
        );
    }
};

const checkDefense = (attacker: Fighter, defender: Fighter, summary: string[]) => {
    const attackerLuckDraw = getRandom(MAX_LUCK, attacker.luck);
    const defenderLuckDraw = getRandom(MAX_LUCK, defender.luck);
    const chance = getBool();

    if (defenderLuckDraw >= MAX_LUCK && chance) {
        const fighter = fighters.getItem(attacker.id);
        attacker.health = roundDown(attacker.health - defender.attack);

        summary.push(
            `**${defender.name}** counters! *${defender.attack}* :boom: **${attacker.name}** \`${attacker.health}/${fighter?.health}\` HP`
        );
    } else if (attacker.boost && attackerLuckDraw >= MAX_LUCK) {
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
        channel.send(`${player.name} lost...`);
    }

    storePlayer(player);
    spawnMonster(channel);
    toggleBattle(false);
};

export const battle = async (channel: TextChannel, playerInfo: PlayerInfo) => {
    try {
        const monster = getMonster();
        const player = await getPlayer(playerInfo);

        if (!monster || !player) return;

        toggleBattle(true);

        fighters.addItem(monster.id, monster);
        fighters.addItem(player.id, player);
        
        startRounds(player, monster, channel);
    } catch (error) {
        logError(error, 'battle');
    }
};
