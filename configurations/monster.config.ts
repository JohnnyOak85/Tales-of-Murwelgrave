import { DataList } from '../helpers/interfaces';

export const BOSSES = ['Lizagon', 'Cave Beast', 'Hume Dragon', 'Siren'];

export const BASE_URL = 'https://raw.githubusercontent.com/JohnnyOak85/Monsters/main';

const forest = {
    ranks: {
        1: {
            '004_Flower_': ['A', 'B', 'C', 'D', 'E'],
            '034_Carrot_': ['A', 'B', 'C', 'D', 'E'],
            '049_Nutsy_': ['A', 'B', 'C', 'D', 'E']
        },
        2: {
            '005_Mushroom_1_': ['A', 'B', 'C', 'D', 'E', 'F'],
            '005_Mushroom_2_': ['A', 'B', 'C'],
            '054_DevilBerry_': ['A', 'B', 'C', 'D', 'E']
        },
        3: {
            '005_Mushroom_3_': ['A', 'B', 'C', 'D', 'E'],
            '026_Snake_': ['A', 'B', 'C', 'D', 'E'],
            '028_Fairy_': ['A', 'B', 'C', 'D', 'E']
        },
        4: {
            '027_Siren_': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            '059_HumeDragon_': ['A', 'B', 'C', 'D', 'E']
        }
    }
};

const cave = {
    ranks: {
        1: {
            '002_SmallSlime_': ['A', 'B', 'C', 'D'],
            '003_Rat_': ['A', 'B', 'C', 'D', 'E']
        },
        2: {
            '001_BigSlime_': ['A', 'B', 'C', 'D'],
            '041_Slime_': ['A', 'B'],
            '043_Goblin_': ['A', 'B', 'C']
        },
        3: {
            '023_Spider_': ['A', 'B', 'C', 'D', 'E', 'F'],
            '024_Scorpion_': ['A', 'B', 'C', 'D', 'E']
        },
        4: {
            '039_Lizagon_': ['A', 'B', 'C', 'D', 'E', 'F'],
            '053_CaveBeast_': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        }
    }
};

export const AREAS: DataList<GameArea> = { forest, cave };

interface GameArea {
    ranks: { [rank: number]: DataList<string[]> };
}
