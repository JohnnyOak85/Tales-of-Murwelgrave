import { ColorResolvable, EmbedBuilder, TextChannel } from 'discord.js';
import { MONSTER_DB } from '../config';
import { Battle, Monster } from '../interfaces';
import { MONSTER_RANK } from '../maps';
import { logError } from '../tools/logger';
import { pickMonster } from './monster.factory';

const COOL_DOWN = 30000;

const currentMonster: Battle = {
    active: false
};

export const hasActiveBattle = () => currentMonster.active;
export const inactivateBattle = () => (currentMonster.active = false);
export const getMonster = () => currentMonster?.monster;

export const clearBattle = () => {
    currentMonster.active = true;

    if (currentMonster.timer) clearInterval(currentMonster.timer);

    delete currentMonster.message;
    delete currentMonster.monster;
    delete currentMonster.timer;
};

const deleteMessage = async () => {
    try {
        if (currentMonster?.message) {
            const activeMessage = await currentMonster.message.channel.messages.fetch(
                currentMonster.message
            );

            if (!activeMessage?.deletable) return;

            activeMessage.delete();
        }
    } catch (error: any) {
        logError(error, 'spawnMonster');
    }
};

const buildEmbed = (monster: Monster) => {
    const embed = new EmbedBuilder()
        .setColor(monster.color as ColorResolvable)
        .setDescription(
            `A level ${monster.level} ${monster.description} ${monster.name}${
                monster.className ? ` ${monster.className}` : ''
            } appears!`
        )
        .setTitle(monster.rank === MONSTER_RANK.boss ? '**BOSS ATTACK**' : '**MONSTER ATTACK**')
        .setThumbnail(`${MONSTER_DB}/${monster.id}.png`);

    return { embeds: [embed] };
};

export const spawnMonster = async (channel: TextChannel) => {
    if (currentMonster.active) {
        setTimeout(() => spawnMonster(channel), COOL_DOWN);
        return;
    }

    if (currentMonster.timer) {
        clearInterval(currentMonster.timer);
    }

    const monster = await pickMonster();
    const embed = buildEmbed(monster);

    deleteMessage();

    currentMonster.message = await channel.send(embed);
    currentMonster.monster = monster;
    currentMonster.timer = setInterval(() => spawnMonster(channel), COOL_DOWN);
};

export const stopSpawner = async () => {
    if (currentMonster.timer) clearInterval(currentMonster.timer);

    deleteMessage();
};
