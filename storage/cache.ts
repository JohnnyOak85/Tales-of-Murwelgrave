import { createClient } from 'redis';
import { Dictionary } from '../interfaces';

const client = createClient();
const TOTAL_TRIES = 3;

export const startCache = async () => {
    let counter = 0;

    try {
        await client.connect();
    } catch (error) {
        if (counter < TOTAL_TRIES) {
            startCache();
            counter++;
        }
    }
}

const ensureOpen = async () => {
    if (!client.isOpen) {
        await startCache();
    }
}

export const getList = async (key: string) => {
    await ensureOpen();

    return client.lRange(key, 0, -1);
}

export const getMap = async (key: string) => {
    await ensureOpen();
    return client.hGetAll(key);
}

export const getValue = async (key: string) => {
    await ensureOpen();
    return client.get(key);
}

export const getListLenght = async (key: string) => {
    await ensureOpen();
    return client.lLen(key);
}

export const saveList = async (key: string, value: string[]) => {
    await ensureOpen();
    client.rPush(key, value);
}

export const saveMap = async (key: string, value: Dictionary<string | number>) => {
    await ensureOpen();
    return client.hSet(key, value);
}

export const saveValue = async (key: string, value: string) => {
    await ensureOpen();
    return client.set(key, value);
}

export const deleteValue = async (key: string) => {
    await ensureOpen();
    return client.del(key);
}
