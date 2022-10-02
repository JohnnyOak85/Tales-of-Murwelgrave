import { createClient } from 'redis';
import { Dictionary } from '../interfaces';

const client = createClient();

export const startCache = () => client.connect();

export const getList = (key: string) => client.lRange(key, 0, -1);
export const getMap = (key: string) => client.hGetAll(key);
export const getValue = (key: string) => client.get(key);
export const getListLenght = (key: string) => client.lLen(key);

export const saveList = (key: string, value: string[]) => client.rPush(key, value);
export const saveMap = (key: string, value: Dictionary<string | number>) => client.hSet(key, value);
export const saveValue = (key: string, value: string) => client.set(key, value);

export const deleteValue = (key: string) => client.del(key);
