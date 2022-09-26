import { createClient } from 'redis';
import { Dictionary } from '../interfaces';

const client = createClient();

export const connect = () => client.connect();

// export const getList = (key: string) => client.lRange(key, 0, -1);
// export const getMap = (key: string) => client.hGetAll(key);
export const getValue = (key: string) => client.get(key); // ! Unused

export const saveList = (key: string, value: string[]) => client.rPush(key, value);
export const saveMap = (key: string, value: Dictionary<string | number>) => client.hSet(key, value);
export const saveValue = (key: string, value: string) => client.set(key, value); // ! Unused

// TODO TEMPORARY CODE

const maps: Dictionary<any> = {
    rank0: { '005_Mushroom_1_': 6 },
    rank1: { '005_Mushroom_2_': 3 },
    rank2: { '005_Mushroom_3_': 5 },
    ranks: {
        '947869609107804171': '947869496146817025',
        '947869496146817025': '947869760115331092',
        '947869760115331092': '',
        '806626101501624350': '947819090217676890',
        '947819090217676890': '947819323714576454',
        '947819323714576454': ''
    }
};

const lists: Dictionary<any[]> = {
    attributes: [
        "Ambition",
        "Appetite",
        "Beauty",
        "Courage",
        "Exam Score",
        "Fever",
        "Friendship",
        "Greediness",
        "Honesty",
        "Humor",
        "Love",
        "Tenderness",
        "Eye Sparkle",
        "Heroism",
        "Maturity",
        "Sincerity",
        "Spirit",
        "Charisma",
        "Coolness",
        "Dreaminess",
        "Flashiness",
        "Foot Speed",
        "Leadership",
        "Trustworthiness",
        "Juggling Skills",
        "Dexterity",
        "Stealth",
        "Hair Shine"
    ],
    colors: [
        '#57F287',
        '#FEE75C',
        '#ED4245',
        '#F1C40F'
    ],
    variations: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
};

export const getMap = (key: string) => maps[key];
export const getList = (key: string) => lists[key];
