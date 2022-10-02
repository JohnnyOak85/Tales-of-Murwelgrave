import { EmbedBuilder, Message } from 'discord.js';
import { Player, PlayerInfo } from '../interfaces';
import { MONSTER_CLASS } from '../maps';
import { getList, getMap, getValue } from '../storage/cache';
import { getDoc, getPlayerDocs, storeDoc } from '../storage/database';
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

const setPlayerBestiary = (bestiary: string | string[] | undefined) =>
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
        attributes: player?.attributes || {},
        attack: Number(player?.attack) || getBaseAttack(),
        bestiary: setPlayerBestiary(player?.bestiary),
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

export const getPlayerBestiary = async (playerInfo: PlayerInfo, message: Message) => {
    const player = await getPlayer(playerInfo);
    const bestiary = player.bestiary.length ? player.bestiary.sort((a, b) => a.localeCompare(b)) : [];
    const totalMonsters = await getValue('total-monsters');
    const monsterDescriptions = await getMap('descriptions');
    const monsters: string[] = [];

    for (const monster of bestiary) {
        const arr = monster.split('_');
        const name = arr[1];
        const index = parseInt(arr[2])
        let description = '';
        let className = '';

        if (index) {
            className = ` ${MONSTER_CLASS[index - 1]}`;
            description = arr[3] ? monsterDescriptions[monster] : '';
        } else {
            description = arr[2] ? monsterDescriptions[monster] : '';
        }

        monsters.push(`${description} ${name}${className}`);
    }

    const embed = new EmbedBuilder()
        .setThumbnail(message.author.avatarURL() || '')
        .setTitle(`${player.name}'s Bestiary`)
        .setFooter({ text: `${player.bestiary.length}/${totalMonsters}` })

    if (monsters.length) {
        embed.setDescription(buildList(monsters))
    }
    
    message.channel.send({embeds: [embed]}); 
}

export const getScoreBoard = async (message: Message) => {
    const players = await getPlayerDocs();
    const scoreBoard: string[] = [];

    if (!players?.length) return;
    
    const sortedPlayers = players
        .sort((a, b) => (a.wins - a.losses) - (b.wins - b.losses))
        .reverse()

    sortedPlayers.forEach((player, i) => {
        scoreBoard.push(`${i + 1}. ${player.name}: ${player.wins - player.losses}`);
    })

    const embed = new EmbedBuilder()
        .setTitle('Score Board');

    if (sortedPlayers.length) {
        embed.setDescription(buildList(scoreBoard));
    }

    message.channel.send({embeds: [embed]});
}

export const getPlayerAttributes = async (playerInfo: PlayerInfo, message: Message) => {
    const player = await getPlayer(playerInfo);
    const attributes = await getList('attributes');
    const list: string[] = [];

    const embed = new EmbedBuilder()
        .setThumbnail(message.author.avatarURL() || '')
        .setTitle(`${player.name}'s Attributes`)
        .setFooter({ text: `${player.attributes.length}/${attributes.length}` })

    for (const attribute in player.attributes) {
        list.push(`${attribute}: ${player.attributes[attribute]}`);
    }

    if (list.length) {
        embed.setDescription(buildList(list))
    }

    message.channel.send({embeds: [embed]}); 
}