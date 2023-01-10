import { Monster } from '../interfaces';
import { MONSTER_CHANCE, MONSTER_CLASS, MONSTER_RANK } from '../maps';
import { getList, getMap } from '../storage/cache';
import { getRandom } from '../tools/math';
import { calcHealth, calcLevel, calcLuck, calcStats } from '../battles/stats';
import { GAME_TYPE } from '../config';
import { logError } from '../tools/logger';

const getRank = (): number => {
    const chance = getRandom();

    if (chance < MONSTER_CHANCE.base) {
        return MONSTER_RANK.base;
    } else if (chance < MONSTER_CHANCE.mid) {
        return MONSTER_RANK.mid;
    } else if (chance < MONSTER_CHANCE.high) {
        return MONSTER_RANK.high;
    } else {
        return GAME_TYPE === 'short' ? getRank() : MONSTER_RANK.boss;
    }
};

const getVariation = (variations: string[], num: number) => variations[getRandom(num - 1, 0)];
const getType = (monsters: string[]) => monsters[getRandom(monsters.length - 1, 0)];

const getMonsterInfo = async (rank: number) => {
    try {
        const monsters = await getMap(`rank${rank - 1}`);
        const variations = await getList('variations');
        const descriptions = await getMap('descriptions');
        const colors = await getList('colors');
        const type = getType(Object.keys(monsters));
        const id = type + getVariation(variations, Number(monsters[type]));
        const classIndex = parseInt(type.split('_')[2]);

        return {
            className: MONSTER_CLASS[classIndex - 1],
            color: colors[rank - 1],
            description: descriptions[id],
            id,
            name: type.split('_')[1]
        };
    } catch (error) {
        logError(error, 'getMonsterInfo');
        throw error;
    }
};

const getMonsterStats = (rank: number) => {
    const level = calcLevel(rank);
    const { attack, defense } = calcStats(level);

    return {
        attack,
        defense,
        health: calcHealth(level),
        level,
        luck: calcLuck(level)
    };
};

export const pickMonster = async (): Promise<Monster> => {
    try {
        const rank = getRank();
        const { className, color, description, id, name } = await getMonsterInfo(rank);
        const { attack, defense, health, level, luck } = getMonsterStats(rank);

        return {
            attack,
            className,
            color,
            defense,
            description,
            health,
            id,
            level,
            luck,
            name,
            rank
        };
    } catch (error) {
        logError(error, 'pickMonster');
        throw error;
    }
};
