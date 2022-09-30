import PouchDB from 'pouchdb';
import { DB_URL } from '../config'; 
import { Dictionary, GameAreas, GameConfig } from '../interfaces';
import { logError } from '../tools/logger';
import { saveList, saveMap, saveValue } from './cache';

// let db: PouchDB.Database<Dictionary<any>>;
const db = new PouchDB<Dictionary<any>>(`${DB_URL}/game`);

export const getDoc = async <T>(id: string) => {
    try {
        const doc = await db.get<T>(id);

        for (const key in doc) {
            if (key.startsWith('_')) {
                delete doc[key];
            }
        }

        return doc as T;
    } catch (error: any) {
        if (error.status === 404) {
            return;
        }

        logError(error, `getDoc -> ${id}`);
    }
};

export const storeDoc = async (doc: Dictionary<any>) => {
    doc._id = doc._id || doc.id;

    try {
        await db.put(doc);
    } catch(error: any) {
        if (error.status === 409) {
            const stored = await db.get(doc._id);

            doc._rev = stored._rev;

            await db.put(doc);
            
            return;
        }

        logError(error, `storeDoc -> ${doc._id || doc.id}`);
    }
}

const storeAreas = async () => {
    try {
        if (!process.env.ACTIVE_AREA) {
            logError('NO ACTIVE AREA', 'storeAreas');
            return;
        }

        const areas = await getDoc<GameAreas>('areas');

        if (!areas) {
            logError('AREAS NOT SET', 'storeAreas');
            return;
        }

        const area = areas[process.env.ACTIVE_AREA];
        let totalMonsters = 0;

        for (const [index, rank] of area.entries()) {
            saveMap(`rank${index}`, rank);

            for (const monster of Object.keys(rank)) {
                totalMonsters += rank[monster];
            }
        }

        saveValue('total-monsters', totalMonsters.toString());
    } catch (error) {
        logError(error, 'storeAreas');
    }
};

const storeConfigs = async () => {
    try {
        const config = await getDoc<GameConfig>('config');

        if (!config) {
            logError('CONFIG NOT SET', 'storeConfigs');
            return;
        }

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
        await Promise.all([storeAreas(), storeConfigs()]);
    } catch (error) {
        logError(error, 'setupGame');
    }
};
