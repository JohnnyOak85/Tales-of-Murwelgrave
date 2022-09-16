import { Message } from 'discord.js';

type MonsterVariation = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
type MonsterRank = Dictionary<MonsterVariation[]>;
export type GameArea = MonsterRank[];

export interface RaffleTicket {
    ticket: string;
    timer: NodeJS.Timeout;
}

export interface Dictionary<T> {
    [x: string]: T;
}

export interface GameConfig {
    list: string[] | Dictionary<string> | Dictionary<GameArea>;
}

export interface Command {
    description: string;
    execute: (message: Message, args?: string[]) => void;
    manager: boolean;
    name: string;
    usage: string;
}

const rank: MonsterRank = {
    '004_Flower_': ['A', 'B', 'C', 'D', 'E'],
    '034_Carrot_': ['A', 'B', 'C', 'D', 'E'],
    '049_Nutsy_': ['A', 'B', 'C', 'D', 'E']
};

const forest: GameArea = [rank];

const doc: GameConfig = {
    list: { forest }
};

/**
 * AREA DOC EXAMPLE
 *
 * const test: AreaDoc = {
 *   list: {
 *      forest: [
 *          {
 *              '004_Flower_': ['A', 'B', 'C', 'D', 'E'],
 *              '034_Carrot_': ['A', 'B', 'C', 'D', 'E'],
 *              '049_Nutsy_': ['A', 'B', 'C', 'D', 'E']
 *          },
 *          {
 *              '005_Mushroom_1_': ['A', 'B', 'C', 'D', 'E', 'F'],
 *              '005_Mushroom_2_': ['A', 'B', 'C'],
 *              '054_DevilBerry_': ['A', 'B', 'C', 'D', 'E']
 *          }
 *      ]
 *   }
 * };
 */
