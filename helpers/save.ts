import { saveDoc } from '../tools/database';
import { Player } from './interfaces';
import { ensurePlayer } from './player';

export const recordPlayer = async (player: Player, guild: string, winner: boolean) => {
    const playerDoc = await ensurePlayer(guild, player.id);
    const stat = winner ? 'wins' : 'losses';

    playerDoc[stat] += 1;
    playerDoc.attack = player.attack;
    playerDoc.bestiary = player.bestiary;
    playerDoc.defense = player.defense;
    playerDoc.health = player.health < playerDoc.health ? playerDoc.health : player.health;
    playerDoc.level = player.level;

    saveDoc(playerDoc, guild, player.id);
};
