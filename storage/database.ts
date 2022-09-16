import PouchDB from 'pouchdb';
import { DB_ADDRESS } from '../config';
import { Dictionary, GameArea, GameConfig } from '../interfaces';
import { appendMap, pushList } from './cache';

const db = new PouchDB<GameConfig>(`${DB_ADDRESS}/game`);

const getConfig = async (id: string) => (await db.get(id)).list;
export const getAreas = async () => (await db.get('areas')).list as Dictionary<GameArea>;
export const getAreaNames = async () => Object.keys(await getAreas());

export const startDatabase = async () => {
    await db.info();

    const [raffle, ranks, roles] = await Promise.all([
        getConfig('raffle') as Promise<string[]>,
        getConfig('ranks') as Promise<Dictionary<string>>,
        getConfig('roles') as Promise<string[]>
    ]);

    pushList('raffle', raffle);
    appendMap('ranks', ranks);
    pushList('roles', roles);
};
