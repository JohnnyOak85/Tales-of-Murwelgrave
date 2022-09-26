import PouchDB from 'pouchdb';
import { Dictionary, GameAreas, GameConfig } from '../interfaces';
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

const storeConfigs = async () => {
    try {
        const config = await getDoc<GameConfig>('config');

        saveList('attributes', config.attributes);
        saveList('colors', config.colors);
        saveMap('ranks', config.ranks);
        saveList('variations', config.variations);
    } catch (error) {
        logError(error, 'storeConfigs');
    }
};

export const setupGame = async () => {
    try {
        await Promise.all([db.info(), connect()]);
        await Promise.all([storeAreas(), storeConfigs()]);
    } catch (error) {
        logError(error, 'setupGame');
    }
};
