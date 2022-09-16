import { BASE_HEALTH, BASE_STAT } from '../configurations/main.config';
import { AREAS } from '../configurations/monster.config';
import { getRandom } from '../tools/utils';

const getRank = () => {
    const chance = getRandom();

    if (chance < 45) {
        return 1;
    } else if (chance < 75) {
        return 2;
    } else if (chance < 95) {
        return 3;
    } else {
        return 4;
    }
};

const getVariation = (variations: string[]) => variations[getRandom(variations.length - 1, 0)];

const getType = (monsters: string[]) => monsters[getRandom(monsters.length - 1, 0)];

const getMonsterInfo = (area: string, rank: number) => {
    const monsters = AREAS[area].ranks[rank];
    const type = getType(Object.keys(monsters));

    return {
        id: type + getVariation(monsters[type]),
        type
    };
};

const getStats = (rank: number) => {
    const level = getRandom(rank * 5, rank * 5 - 4);
    const statMin = (BASE_STAT + 5) * level;
    const statMax = statMin * 2;

    return { level, statMin, statMax, divider: getRandom(statMax, statMin) };
};

const pickColor = (rank: number) => {
    switch (rank) {
        case 1:
            return '#57F287';
        case 2:
            return '#FEE75C';
        case 3:
            return '#ED4245';
        default:
            return '#F1C40F';
    }
};

export const pickMonster = (area: string) => {
    const rank = getRank();
    const { id, type } = getMonsterInfo(area, rank);
    const { level, statMin, statMax, divider } = getStats(rank);

    return {
        attack: statMax - divider,
        color: pickColor(rank),
        defense: statMin + divider,
        health: BASE_HEALTH + getRandom(BASE_HEALTH * (level / 5), BASE_HEALTH * (level / 7)),
        id,
        level,
        luck: getRandom(level * 5),
        name: type.split('_')[1],
        rank
    };
};
