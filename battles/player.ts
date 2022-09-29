import { EmbedBuilder, Message } from 'discord.js';
import { Player, PlayerInfo } from '../interfaces';
import { getMap } from '../storage/cache';
import { getDoc, storeDoc } from '../storage/database';
import { Collector } from '../tools/collector';
import { getRandom } from '../tools/math';
import { buildList } from '../tools/text';
import { getBaseAttack, getBaseDefense, getBaseHealth } from './stats';

const DEFAULT_NAME = 'Player';

const players = new Collector<Player>();

export const storePlayer = async (player: Player) => {
    players.addItem(player.id, player);
    storeDoc(player);
}

const getPlayerBestiary = (bestiary: string | string[] | undefined) =>
    typeof bestiary === 'string' ? (JSON.parse(bestiary) as string[]) : bestiary || [];

const getPlayerRank = async (playerTitles: string[]) => {
    const ranks = Object.keys(await getMap('ranks'));
    const playerRanks = playerTitles.filter(title => ranks.includes(title));
    const index = getRandom(playerRanks.length) - 1;

    return playerRanks[index];
}

export const getPlayer = async (playerInfo: PlayerInfo) => {
    let player = players.getItem(playerInfo.id) || await getDoc(playerInfo.id);
    let noRecord = false;

    if (!player) {
        noRecord = true;
    }

    player = {
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
        rank: player?.rank || await getPlayerRank(playerInfo.titles),
        wins: Number(player?.wins) || 0
    };

    if (noRecord) {
        storePlayer(player);
    }

    return player;
};

export const getPlayerStats = async (playerInfo: PlayerInfo, message: Message) => {
    const player = await getPlayer(playerInfo);
    const stats = [
        `Health: ${player.health}`,
        `Attack: ${player.attack}`,
        `Defense: ${player.defense}`,
        `Luck: ${player.luck}`,
    ];

    const rank = await message.guild?.roles.fetch(player.rank);
    const embed = new EmbedBuilder()
        .setThumbnail(message.author.avatarURL() || '')
        .setTitle(`${player.name} | Level ${player.level} ${rank?.name}`)
        .setDescription(buildList(stats))
        .setFields({
            name: 'Records',
            value: `Wins: ${player.wins} | Losses: ${player.losses}`
        })

        if (player.achievements.length) {
            embed.addFields({
                name: 'Achievements',
                value: buildList(player.achievements)
            })
        }

        message.channel.send({embeds: [embed]});
}
