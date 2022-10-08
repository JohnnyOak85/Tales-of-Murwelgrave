import { createClient } from 'redis';
import { Dictionary } from '../interfaces';
import { logError } from '../tools/logger';

const client = createClient();
const TOTAL_TRIES = 3;

export const checkCache = () => client.isOpen;

export const startCache = async () => {
    if (client.isOpen) return;

    let counter = 0;

    try {
        await client.connect();
    } catch (error) {
        logError(error, 'startCache');

        if (counter < TOTAL_TRIES) {
            startCache();
            counter++;
        }
    }
};

const ensureOpen = async () => {
    if (!client.isOpen) {
        await startCache();
    }
};

export const getList = async (key: string) => {
    try {
        await ensureOpen();
        return client.lRange(key, 0, -1);
    } catch (error) {
        logError(error, 'getList');
        throw error;
    }
};

export const getMap = async (key: string) => {
    try {
        await ensureOpen();
        return client.hGetAll(key);
    } catch (error) {
        logError(error, 'getMap');
        throw error;
    }
};

export const getValue = async (key: string) => {
    try {
        await ensureOpen();
        return client.get(key);
    } catch (error) {
        logError(error, 'getValue');
        throw error;
    }
};

export const getListLenght = async (key: string) => {
    try {
        await ensureOpen();
        return client.lLen(key);
    } catch (error) {
        logError(error, 'getListLenght');
        throw error;
    }
};

export const saveList = async (key: string, value: string[]) => {
    try {
        await ensureOpen();
        client.rPush(key, value);
    } catch (error) {
        logError(error, 'saveList');
        throw error;
    }
};

export const saveMap = async (key: string, value: Dictionary<string | number>) => {
    try {
        await ensureOpen();
        return client.hSet(key, value);
    } catch (error) {
        logError(error, 'saveMap');
        throw error;
    }
};

export const saveValue = async (key: string, value: string) => {
    try {
        await ensureOpen();
        return client.set(key, value);
    } catch (error) {
        logError(error, 'saveValue');
        throw error;
    }
};

export const deleteValue = async (key: string) => {
    try {
        await ensureOpen();
        return client.del(key);
    } catch (error) {
        logError(error, 'deleteValue');
        throw error;
    }
};
