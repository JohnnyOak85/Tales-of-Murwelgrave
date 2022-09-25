import { TextChannel } from 'discord.js';
import { Monster, Player } from '../interfaces';
import { getBool, getRandom, multiply } from '../tools/math';
import { buildList } from '../tools/text';
import { storePlayer } from './player';

/**
 * Monsters
 */
const checkMonster = (player: Player, monster: Monster) => {
    if (!player.bestiary.includes(monster.id)) {
        player.bestiary.push(monster.id);
    }

    if (monster.rank <= 4) return '';
    
    player.achievements.push(`${monster.name} Slayer`);

    return `You just defeated the **${monster.name}**! Congratulations!`;
}

/**
 * STATS
 */
const STAT_CAP = 2000;

const splitExp = (experience: number) => {
    const attackBuff = getBool();
    const split = getRandom(experience);
    const comparer = experience - split;

    const bigSlice = comparer > split ? comparer : split;
    const littleSlice = comparer < split ? comparer : split

    return {
         attackBoost : attackBuff ? bigSlice : littleSlice,
         defenseBoost : attackBuff ? littleSlice : bigSlice
    }
};

const boostStat = (player: Player, stat: 'attack' | 'defense', boost: number) => {
    if (player[stat] >= STAT_CAP) return '';

    player[stat] += boost;

    return `**+${boost} ${stat}.**`;
};

/**
 * HEALTH
 */
const HEALTH_CAP = 1000;

const MAX_HEALTH_CONTROL = 60;
const MIN_HEALTH_CONTROL = 45;

const boostHealth = (player: Player) => {
    if (player.health > HEALTH_CAP) return '';

    const gain = getRandom(MAX_HEALTH_CONTROL, MIN_HEALTH_CONTROL);
    player.health += gain + multiply(player.level);

    return `**+${gain} health.**`
}

/**
 * LUCK
 */
const LUCK_CAP = 100;

const boostLuck = (player: Player, monster: Monster) => {
    if (player.luck >= LUCK_CAP) return '';

    const playerStats = player.level + player.attack + player.defense + player.health + player.luck;
    const monsterStats = monster.level + monster.attack + monster.defense + monster.health + monster.luck;

    if (playerStats <= monsterStats) return '';
    
    player.luck += 1;

    return `**+1 luck.**`;    
};

/**
 * LEVEL
 */
const MAX_LEVEL = 20;

const levelUp = (player: Player) => {
    if (player.level >= MAX_LEVEL) return '';
    
    const levelControl = (player.level + 1) * 100;
    const playerStats = player.attack + player.defense;

    if (playerStats <= levelControl) return '';

    player.level += 1;

    return `Level up! **${player.level - 1} -> ${player.level}**`;
};

/**
 * Rank
 */

const rankUp = (player: Player) => {
    if (player.level <= MAX_LEVEL) return '';

    player.rank += 1;

    return `Rank up! **${player.rank -1} -> ${player.rank}`;
}

export const getBuffs = (
    player: Player,
    monster: Monster,
    channel: TextChannel
) => {
    const reply = [`**${player.name}** wins!`];
    const currentLevel = player.level;
    const experience = Math.max(1, Math.floor((monster.level * 4) / player.level));
    const { attackBoost, defenseBoost } = splitExp( experience);
    
    reply.push(checkMonster(player, monster));
    reply.push(levelUp(player));
    reply.push(rankUp(player));

    if (player.level > currentLevel) {
        reply.push(boostHealth(player));
    }

    reply.push(boostStat(player, 'attack', attackBoost));
    reply.push(boostStat(player, 'defense', defenseBoost));
    reply.push(boostLuck(player, monster));
    
    storePlayer(player);

    channel.send(buildList(reply));
};
