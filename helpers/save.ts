import { findDoc, saveDoc } from '../tools/database';
import { Duelist } from './interfaces';

export const recordWinner = async (winner: Duelist, guild: string) => {
  const doc = await findDoc<Duelist>(guild, winner.id);

  if (!doc) return;

  winner.health =
    winner.health < (doc?.health || 100) ? doc?.health || 100 : winner.health;

  doc.wins = (doc?.wins || 0) + 1;

  saveDoc(Object.assign(doc, winner), guild, winner.id);
};

export const recordLoser = async (loser: Duelist, guild: string) => {
  const doc = await findDoc<Duelist>(guild, loser.id);

  if (!doc) return;

  loser.health =
    loser.health < (doc?.health || 100) ? doc?.health || 100 : loser.health;

  doc.losses = (doc?.losses || 0) + 1;

  saveDoc(Object.assign(doc, loser), guild, loser.id);
};
