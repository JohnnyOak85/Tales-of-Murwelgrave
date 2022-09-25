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
    colors: {
        1: '#57F287',
        2: '#FEE75C',
        3: '#ED4245',
        4: '#F1C40F'
    }
};

const lists: Dictionary<any[]> = {
    variations: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
};

export const getMap = (key: string) => maps[key];
export const getList = (key: string) => lists[key];
