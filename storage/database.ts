import PouchDB from 'pouchdb';
import { ACTIVE_AREA, DB_URL } from '../config'; 
import { Dictionary, GameAreas, GameConfig, Player } from '../interfaces';
import { logError } from '../tools/logger';
import { deleteValue, getList, saveList, saveMap, saveValue, startCache } from './cache';

// let db: PouchDB.Database<Dictionary<any>>;
const db = new PouchDB<Dictionary<any>>(`${DB_URL}/game`);

export const getPlayerDocs = async () => {
    try {
        const res = await db.allDocs<Player>({ include_docs: true });

        return res.rows.map(row => row.doc).filter(doc => doc).filter(doc => !['areas', 'config'].includes(doc?._id || '')).map(doc => {
            for (const key in doc) {
                if (key.startsWith('_')) {
                    delete doc[key];
                }
            }

            return doc;
        }) as Player[];
    } catch(error) {
        logError(error, 'getPlayerDocs');
    }
}

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
        const areas = await getDoc<GameAreas>('areas');

        if (!areas) {
            logError('AREAS NOT SET', 'storeAreas');
            return;
        }

        const area = areas[ACTIVE_AREA];
        let totalMonsters = 0;

        for (const [index, rank] of area.entries()) {
            saveMap(`rank${index}`, rank);

            for (const monster of Object.keys(rank)) {
                totalMonsters += rank[monster];
            }
        }

        saveValue('total-monsters', `${totalMonsters}`);
    } catch (error) {
        logError(error, 'storeAreas');
    }
};

const storeLists = async (config: GameConfig) => {
    const [attributes, colors, variations] = await Promise.all([
        getList('attributes'),
        getList('colors'),
        getList('variations')
    ])

    if (attributes?.length !== config.attributes.length) {
        deleteValue('attributes');
        saveList('attributes', config.attributes);
    }

    if (colors?.length !== config.colors.length) {
        deleteValue('colors');
        saveList('colors', config.colors);
    }

    if (variations?.length !== config.variations.length) {
        deleteValue('variations');
        saveList('variations', config.variations);
    }
}

const storeConfigs = async () => {
    try {
        const config = await getDoc<GameConfig>('config');

        if (!config) {
            logError('CONFIG NOT SET', 'storeConfigs');
            return;
        }

        storeLists(config);
        saveMap('descriptions', config.descriptions);
        saveMap('ranks', config.ranks);
    } catch (error) {
        logError(error, 'storeConfigs');
    }
};

export const setupGame = async () => {
    try {
        await startCache()
        await Promise.all([storeAreas(), storeConfigs()]);
    } catch (error) {
        logError(error, 'setupGame');
    }
};
