import { Player, PlayerInfo } from '../interfaces';
import { getMap } from '../storage/cache';
import { Collector } from '../tools/collector';
import { getRandom } from '../tools/math';
import { buildList } from '../tools/text';
import { getBaseAttack, getBaseDefense, getBaseHealth } from './stats';

const DEFAULT_NAME = 'Player';

const players = new Collector<Player>();

export const storePlayer = async (player: Player) => {
    players.addItem(player.id, player);
}

const getPlayerBestiary = (bestiary: string | string[] | undefined) =>
    typeof bestiary === 'string' ? (JSON.parse(bestiary) as string[]) : bestiary || [];

const getPlayerRank = (playerTitles: string[]) => {
    const ranks = Object.keys(getMap('ranks'));
    const playerRanks = playerTitles.filter(title => ranks.includes(title));
    const index = getRandom(playerRanks.length) - 1;

    return playerRanks[index];
}

export const getPlayer = (playerInfo: PlayerInfo) => {
    const player = players.getItem(playerInfo.id);

    return {
        achievements: player?.achievements || [],
        attack: Number(player?.attack) || getBaseAttack(),
        bestiary: getPlayerBestiary(player?.bestiary),
        defense: Number(player?.defense) || getBaseDefense(),
        health: Number(player?.health) || getBaseHealth() + 50,
        id: player?.id || playerInfo.id,
        level: Number(player?.level) || 1,
        losses: Number(player?.losses) || 0,
        luck: Number(player?.luck) || 1,
        messages: Number(player?.messages) || 0,
        name: player?.name || playerInfo.name || DEFAULT_NAME,
        rank: player?.rank || getPlayerRank(playerInfo.titles),
        wins: Number(player?.wins) || 0
    };
};

export const getPlayerStats = (playerInfo: PlayerInfo) => {
    const player = getPlayer(playerInfo);
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

    // TODO Build embed
    return buildList(stats);
}
