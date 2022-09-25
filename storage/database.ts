import PouchDB from 'pouchdb';
import { Dictionary, GameAreas, GameConfig, PlayerRanks } from '../interfaces';
import { logError } from '../tools/logger';
import { connect, saveList, saveMap } from './cache';

const db = new PouchDB<Dictionary<any>>(`${process.env.DB_URL}/game`);

export const getDoc = async <T>(id: string) => {
    try {
        const doc = await db.get<T>(id);

        for (const key in doc) {
            if (key.startsWith('_')) {
                delete doc[key];
            }
        }

        return doc;
    } catch (error) {
        throw error;
    }
};

const storeAreas = async () => {
    try {
        if (!process.env.ACTIVE_AREA) {
            logError('NO ACTIVE AREA', 'storeAreas');
            return;
        }

        const areas = await getDoc<GameAreas>('areas');
        const area = areas[process.env.ACTIVE_AREA];

        for (const [index, rank] of area.entries()) {
            saveMap(`rank${index}`, rank);
        }
    } catch (error) {
        logError(error, 'storeAreas');
    }
};

const storeRanks = async () => {
    try {
        const ranks = await getDoc<PlayerRanks>('ranks');

        saveMap('ranks', ranks);
    } catch (error) {
        logError(error, 'storeRanks');
    }
};

const storeConfigs = async () => {
    try {
        const config = await getDoc<GameConfig>('config');

        saveList('variations', config.variations);
        saveMap('colors', config.colors);
    } catch (error) {
        logError(error, 'storeConfigs');
    }
};

export const setupGame = async () => {
    try {
        await Promise.all([db.info(), connect()]);
        await Promise.all([connect()]);
        await Promise.all([storeAreas(), storeRanks(), storeConfigs()]);
    } catch (error) {
        logError(error, 'setupGame');
    }
};
