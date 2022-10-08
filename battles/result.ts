import { DiscordAPIError, TextChannel } from 'discord.js';
import { ACTIVE_AREA } from '../config';
import { Dictionary, Monster, Player } from '../interfaces';
import { getList, getMap, getValue } from '../storage/cache';
import { logError } from '../tools/logger';
import { getBool, getRandom, multiply } from '../tools/math';
import { buildList } from '../tools/text';

/**
 * MONSTERS
 */

const getAreaName = () => {
    const split = ACTIVE_AREA.split('_');
    const name = [];

    for (let word of split) {
        name.push(word[0].toUpperCase() + word.substring(1));
    }

    return name.join(' ');
};

const checkMonster = async (player: Player, monster: Monster) => {
    const totalMonsters = await getValue('total-monsters');

    if (!player.bestiary.includes(monster.id)) {
        player.bestiary.push(monster.id);
    }

    if (!totalMonsters) return '';

    const achievement = `${getAreaName()} Conqueror`;

    if (
        player.bestiary.length === parseInt(totalMonsters) &&
        !player.achievements.includes(achievement)
    ) {
        player.achievements.push(achievement);

        return `You just defeated every monster! Congratulations!`;
    }

    return '';
};

const checkBoss = (player: Player, monster: Monster) => {
    if (monster.rank < 4) return '';

    const achievement = `${monster.name} Slayer`;

    if (!player.achievements.includes(achievement)) {
        player.achievements.push(`${monster.name} Slayer`);
    }

    return `You just defeated the **${monster.name}**! Congratulations!`;
};

/**
 * STATS
 */
const STAT_CAP = 2000;

const splitExp = (experience: number) => {
    const attackBuff = getBool();
    const split = getRandom(experience);
    const comparer = experience - split;

    const bigSlice = comparer > split ? comparer : split;
    const littleSlice = comparer < split ? comparer : split;

    return {
        attackBoost: attackBuff ? bigSlice : littleSlice,
        defenseBoost: attackBuff ? littleSlice : bigSlice
    };
};

const boostStats = (player: Player, monsterLevel: number, reply: string[]) => {
    if (player.attack + player.defense >= STAT_CAP) return '';

    const experience = Math.max(1, Math.floor((monsterLevel * 4) / player.level));
    const { attackBoost, defenseBoost } = splitExp(experience);

    reply.push(boostStat(player, 'attack', attackBoost));
    reply.push(boostStat(player, 'defense', defenseBoost));
};

const boostStat = (player: Player, stat: 'attack' | 'defense', boost: number) => {
    if (!boost) return '';

    player[stat] += boost;

    return `**+${boost} ${stat[0].toUpperCase()}${stat.substring(1)}.**`;
};

const checkStats = (player: Player) => {
    const achievement = 'Maxed all stats';

    if (
        player.attack + player.defense >= STAT_CAP &&
        player.health >= HEALTH_CAP &&
        player.luck >= LUCK_CAP &&
        !player.achievements.includes(achievement)
    ) {
        player.achievements.push(achievement);

        return 'You maxed up all you stats! Congratulations';
    }

    return '';
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

    return `**+${gain} Health.**`;
};

/**
 * LUCK
 */
const LUCK_CAP = 100;
const LUCK_CHANCE = 20;

const boostLuck = (player: Player, monster: Monster) => {
    if (player.luck >= LUCK_CAP) return '';

    const playerStats = player.level + player.attack + player.defense + player.health + player.luck;
    const monsterStats =
        monster.level + monster.attack + monster.defense + monster.health + monster.luck;
    const chance = getRandom();

    if (playerStats >= monsterStats || chance > LUCK_CHANCE) return '';

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
 * RANK
 */
// TODO Players are ranking twice in a row
const rankUp = async (player: Player, channel: TextChannel) => {
    if (player.level < MAX_LEVEL) return '';

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
    } catch (error) {
        if ((error as DiscordAPIError).status === 403) {
            logError(error, 'rankUp -> forbidden');
            return '';
        }

        if (
            (error as DiscordAPIError).status === 404 &&
            (error as DiscordAPIError).method === 'DELETE'
        ) {
            logError(error, 'rankUp -> not found');
            return '';
        }

        logError(error, 'rankUp');
        return '';
    }

    player.achievements.push(`Ranked up to ${newRank.name}`);

    return `Rank up! **${oldRank.name} -> ${newRank.name}**`;
};

/**
 * ATTRIBUTES
 */
const MAX_ATTRIBUTES = 3;
const MAX_ATTRIBUTE_GAIN = 50;

const boostAttributes = async (player: Player, reply: string[]) => {
    const attributes = await getList('attributes');
    const attributesGained: Dictionary<number> = {};
    let gainCounter = 1;

    while (gainCounter <= MAX_ATTRIBUTES) {
        const chance = getBool();

        if (chance) {
            const index = getRandom(attributes.length) - 1;
            player.attributes[attributes[index]] = player.attributes[attributes[index]] || 0;

            if (player.attributes[attributes[index]] < MAX_ATTRIBUTE_GAIN) {
                player.attributes[attributes[index]] += 1;
                attributesGained[attributes[index]] =
                    (attributesGained[attributes[index]] || 0) + 1;
            }
        }

        gainCounter++;
    }

    for (const stat in attributesGained) {
        reply.push(`**+${attributesGained[stat]} ${stat}.**`);
    }

    let attributeCounter = 0;

    for (const attribute of attributes) {
        if (player.attributes[attribute] >= MAX_ATTRIBUTE_GAIN) {
            attributeCounter++;
        }
    }

    const achievement = 'Maxed all attributes';

    if (attributeCounter === attributes.length && !player.achievements.includes(achievement)) {
        player.achievements.push(achievement);
        reply.push('Congratulations, you just maxed all possible attributes!');
    }
};

export const getBuffs = async (player: Player, monster: Monster, channel: TextChannel) => {
    const reply = [`**${player.name}** wins!`];
    const currentLevel = player.level;

    reply.push(checkBoss(player, monster));
    reply.push(await checkMonster(player, monster));
    reply.push(levelUp(player));
    reply.push(await rankUp(player, channel));
    reply.push(boostHealth(player, currentLevel));
    boostStats(player, monster.level, reply);
    reply.push(boostLuck(player, monster));
    reply.push(checkStats(player));

    await boostAttributes(player, reply);

    channel.send(buildList(reply));
};
