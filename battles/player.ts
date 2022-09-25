import { Player } from '../interfaces';
import { Collector } from '../tools/collector';
import { buildList } from '../tools/text';
import { getBaseAttack, getBaseDefense, getBaseHealth } from './stats';

const DEFAULT_NAME = 'Player';

const players = new Collector<Player>();

export const storePlayer = async (player: Player) => {
    players.addItem(player.id, player);
}

const getPlayerBestiary = (bestiary: string | string[] | undefined) =>
    typeof bestiary === 'string' ? (JSON.parse(bestiary) as string[]) : bestiary || [];

export const getPlayer = (playerId: string, playerName: string) => {
    const player = players.getItem(playerId);

    return {
        achievements: player?.achievements || [],
        attack: Number(player?.attack) || getBaseAttack(),
        bestiary: getPlayerBestiary(player?.bestiary),
        defense: Number(player?.defense) || getBaseDefense(),
        health: Number(player?.health) || getBaseHealth() + 50,
        id: player?.id || playerId,
        level: Number(player?.level) || 1,
        losses: Number(player?.losses) || 0,
        luck: Number(player?.luck) || 1,
        messages: Number(player?.messages) || 0,
        name: player?.name || playerName || DEFAULT_NAME,
        rank: player?.rank || 1,
        wins: Number(player?.wins) || 0
    };
};

export const getPlayerStats = (name: string, playerName: string) => {
    const player = getPlayer(name, playerName);
    const stats = [
        `Level: ${player.level}`,
        `Health: ${player.health}`,
        `Attack: ${player.attack}`,
        `Defense: ${player.defense}`,
        `Luck: ${player.luck}`,
        `Wins: ${player.wins}`,
        `Losses: ${player.losses}`,
    ]
   
    if (player.achievements.length) {
        stats.push('Achievements:');

        player.achievements.forEach(achievement => stats.push(`- ${achievement}`));
    }

    return buildList(stats);
}
