import { createClient } from 'redis';
import { Dictionary } from '../interfaces';

const client = createClient();

export const connect = async () => await client.connect();

export const getValue = async (key: string) => await client.get(key);

export const getList = async (key: string) => await client.lRange(key, 0, -1);
export const appendList = async (key: string, value: string) => await client.rPush(key, value);
export const pushList = async (key: string, value: string[]) => await client.rPush(key, value);

export const getMap = async (key: string) => await client.hGetAll(key);
export const appendMap = async (key: string, entry: Dictionary<string>) =>
    await client.hSet(key, entry);
