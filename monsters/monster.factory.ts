import { Monster } from '../interfaces';
import { MONSTER_CHANCE, MONSTER_RANK } from '../maps';
import { getList, getMap } from '../storage/cache';
import { getRandom } from '../tools/math';
import { calcHealth, calcLevel, calcLuck, calcStats } from '../battles/stats';

const getRank = (): number => {
    const chance = getRandom();

    if (chance < MONSTER_CHANCE.base) {
        return MONSTER_RANK.base;
    } else if (chance < MONSTER_CHANCE.mid) {
        return MONSTER_RANK.mid;
    } else if (chance < MONSTER_CHANCE.high) {
        return MONSTER_RANK.high;
    } else {
        return process.env.GAME_TYPE === 'short' ? getRank() : MONSTER_RANK.boss;
    }
};

const getVariation = (variations: string[], num: number) => variations[getRandom(num - 1, 0)];
const getType = (monsters: string[]) => monsters[getRandom(monsters.length - 1, 0)];

const getMonsterInfo = async (rank: number) => {
    const monsters = await getMap(`rank${rank - 1}`);
    const variations = await getList('variations');
    const colors = await getMap('colors');
    const type = getType(Object.keys(monsters));

    return {
        color: colors[rank],
        id: type + getVariation(variations, Number(monsters[type])),
        name: type.split('_')[1]
    };
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
    const rank = getRank();
    const { color, id, name } = await getMonsterInfo(rank);
    const { attack, defense, health, level, luck } = getMonsterStats(rank);

    return { attack, color, defense, health, id, level, luck, name, rank };
};
