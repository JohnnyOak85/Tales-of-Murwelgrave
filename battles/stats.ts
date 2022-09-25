import { divide, getRandom } from '../tools/math';

/**
 * BASE PLAYER STATS
 */
const BASE_PLAYER_STAT = 50;

export const getBaseAttack = () => BASE_PLAYER_STAT;
export const getBaseDefense = () => BASE_PLAYER_STAT;
export const getBaseHealth = () => BASE_HEALTH;

/**
 * LEVEL
 */
const MAX_LEVEL_MULTIPLIER = 5;
const MIN_LEVEL_DECREMENT = 4;

const calcMaxLevel = (rank: number) => rank * MAX_LEVEL_MULTIPLIER;
const calcMinLevel = (maxLevel: number) => maxLevel - MIN_LEVEL_DECREMENT;

export const calcLevel = (rank: number) => {
    const maxLevel = calcMaxLevel(rank);
    const minLevel = calcMinLevel(maxLevel);

    return getRandom(maxLevel, minLevel);
};

/**
 * ATTACK AND DEFENSE
 */
const STAT_CONTROL = 15;
const STAT_DIVIDER = 1.5;
const MAX_STAT_MULTIPLIER = 2;
const MIN_STAT_INCREMENT = 5;

const calcStatMin = (level: number) => (STAT_CONTROL + MIN_STAT_INCREMENT) * level;
const calcStatMax = (statMin: number) => statMin * MAX_STAT_MULTIPLIER;

export const calcStats = (level: number) => {
    const statMin = calcStatMin(level);
    const statMax = calcStatMax(statMin);
    const statMedian = getRandom(statMax, statMin);
    const divider = divide(statMedian, STAT_DIVIDER);

    return {
        attack: statMax - divider,
        defense: statMin + divider
    };
};

/**
 * HEALTH
 */
const BASE_HEALTH = 300;
const MAX_HEALTH_DIVISOR = 3;
const MIN_HEALTH_DIVISOR = 6;

const getHealthControl = (level: number, divisor: number) => BASE_HEALTH * (level / divisor);

export const calcHealth = (level: number) => {
    const minHealth = getHealthControl(level, MIN_HEALTH_DIVISOR);
    const maxHealth = getHealthControl(level, MAX_HEALTH_DIVISOR);
    const healthMedian = getRandom(maxHealth, minHealth);

    return BASE_HEALTH + healthMedian;
};

/**
 * LUCK
 */
const LUCK_MULTIPLIER = 5;

export const calcLuck = (level: number) => {
    const maxLuck = level * LUCK_MULTIPLIER;

    return getRandom(maxLuck);
};
