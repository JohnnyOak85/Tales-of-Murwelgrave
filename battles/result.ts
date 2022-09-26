import { DiscordAPIError, TextChannel } from 'discord.js';
import { Monster, Player } from '../interfaces';
import { getList, getMap, getValue } from '../storage/cache';
import { logError } from '../tools/logger';
import { getBool, getRandom, multiply } from '../tools/math';
import { buildList } from '../tools/text';

/**
 * Monsters
 */

const getAreaName = () => {
    const area = process.env.ACTIVE_AREA;
    
    if (!area) return 'Area';

    const split = area.split('_');
    const name = [];

    for (let word of split) {
        name.push(word[0].toUpperCase() + word.substring(1))
    }

    return name.join(' ');
}

const checkMonster = async (player: Player, monster: Monster) => {
    const totalMonsters = await getValue('total_monsters');

    if (!player.bestiary.includes(monster.id)) {
        player.bestiary.push(monster.id);
    }
    
    if (!totalMonsters) return '';

    if (player.bestiary.length === parseInt(totalMonsters)) {
        player.achievements.push(`${getAreaName()} Conqueror`);
        
        return `You just defeated every monster! Congratulations!`;
    }

    return '';
}

const checkBoss = (player: Player, monster: Monster) => {
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
    if (!boost || player[stat] >= STAT_CAP) return '';

    player[stat] += boost;

    return `**+${boost} ${stat}.**`;
};

/**
 * HEALTH
 */
const HEALTH_CAP = 1000;

const MAX_HEALTH_CONTROL = 60;
const MIN_HEALTH_CONTROL = 45;

const boostHealth = (player: Player, currentLevel: number) => {
    if (player.level <= currentLevel || player.health > HEALTH_CAP) return '';

    const gain = getRandom(MAX_HEALTH_CONTROL, MIN_HEALTH_CONTROL);
    player.health += gain + multiply(player.level);

    return `**+${gain} Health.**`
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

    return `**+1 Luck.**`;    
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
const rankUp = async (player: Player, channel: TextChannel) => {
    if (player.level <= MAX_LEVEL) return '';

    const oldRank = await channel.guild.roles.fetch(player.rank);
    
    if (!oldRank?.id) return '';

    const playerRanks = await getMap('ranks');
    const newRank = await channel.guild.roles.fetch(playerRanks[player.rank]);

    if (!newRank?.id) return '';

    player.rank = newRank.id;

    const member = await channel.guild.members.fetch(player.id);

    try {
        member.roles.remove(oldRank);
        member.roles.add(newRank);
    } catch(error) {
        if ((error as DiscordAPIError).status === 403) {
            logError(error, 'rankUp');
            return '';
        }

        if ((error as DiscordAPIError).status === 404 && (error as DiscordAPIError).method === 'DELETE') {
            logError(error, 'rankUp');
            return '';
        }

        console.log(error);
        return '';
    }

    return `Rank up! **${oldRank.name} -> ${newRank.name}**`;
}

/**
 * Fake Stats
 */
const MAX_ATTRIBUTES = 3;

const boostRandomStat = async (reply: string[]) => {
    const attributes = await getList('attributes');
    let count = 0;

    while (count <= MAX_ATTRIBUTES) {
        const chance = getBool();

        if (chance) {
            const index = getRandom(attributes.length) - 1;
            attributes.splice(index, 1);
            reply.push(`**+1 ${attributes[index]}.**`);
        }

        count++;
    }
}

export const getBuffs = async (
    player: Player,
    monster: Monster,
    channel: TextChannel
) => {
    const reply = [`**${player.name}** wins!`];
    const currentLevel = player.level;
    const experience = Math.max(1, Math.floor((monster.level * 4) / player.level));
    const { attackBoost, defenseBoost } = splitExp(experience);
    
    reply.push(checkBoss(player, monster));
    reply.push(await checkMonster(player, monster));
    reply.push(levelUp(player));
    reply.push(await rankUp(player, channel));
    reply.push(boostHealth(player, currentLevel));
    reply.push(boostStat(player, 'attack', attackBoost));
    reply.push(boostStat(player, 'defense', defenseBoost));
    reply.push(boostLuck(player, monster));

    await boostRandomStat(reply);

    channel.send(buildList(reply));
};
