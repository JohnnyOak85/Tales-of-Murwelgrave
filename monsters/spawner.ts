import { ColorResolvable, EmbedBuilder, Message, TextChannel, time } from 'discord.js';
import { MONSTER_DB } from '../config';
import { Monster } from '../interfaces';
import { MONSTER_RANK } from '../maps';
import { logError } from '../tools/logger';
import { pickMonster } from './monster.factory';

const COOL_DOWN = 30000;

let activeBattle = false;
let timer: NodeJS.Timeout;
let activeMonster: {
    message?: Message;
    monster?: Monster;
};

export const toggleBattle = (toggle: boolean) => activeBattle = toggle;

export const getMonster = () => {
    if (timer) clearInterval(timer);

    delete activeMonster.message;

    return activeMonster?.monster;
}

const deleteMessage = async () => {
    try {
        if (activeMonster?.message) {
            const activeMessage = await activeMonster.message.channel.messages.fetch(activeMonster.message);
            activeMessage?.delete();
        }
    } catch(error: any) {
        if (error.status !== 404) logError(error, 'spawnMonster');
    }
}

const buildEmbed = (monster: Monster) => {
    const embed = new EmbedBuilder()
        .setColor(monster.color as ColorResolvable)
        .setDescription(`A level ${monster.level} ${monster.description} ${monster.name}${monster.className ? ` ${monster.className}` : ''} appears!`)
        .setTitle(monster.rank === MONSTER_RANK.boss ? '**BOSS ATTACK**' : '**MONSTER ATTACK**')
        .setThumbnail(`${MONSTER_DB}/${monster.id}.png`);

    return { embeds: [embed] };
};

export const spawnMonster = async (channel: TextChannel) => {
    if (activeBattle) {
        setTimeout(() => spawnMonster(channel), COOL_DOWN);
        return;
    }

    clearInterval(timer);

    const monster = await pickMonster();
    const embed = buildEmbed(monster);
    
    deleteMessage();

    activeMonster = {
        monster,
        message: await channel.send(embed)
    }
    
    timer = setInterval(() => spawnMonster(channel), COOL_DOWN);
}

export const stopSpawner = async () => {
    if (timer) clearInterval(timer);

    deleteMessage();
}