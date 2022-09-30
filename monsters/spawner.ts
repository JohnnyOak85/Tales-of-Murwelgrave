import { ColorResolvable, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { MONSTER_DB } from '../config';
import { Monster } from '../interfaces';
import { MONSTER_RANK } from '../maps';
import { Collector } from '../tools/collector';
import { pickMonster } from './monster.factory';

const COOL_DOWN = 30000;
const TICKET = 'current';

const monsters = new Collector<{
    message: Message;
    monster: Monster;
    timer: NodeJS.Timeout;
}>();

const cleanPrevious = async () => {
    try {
        const previous = monsters.getItem(TICKET);
        
        if (!previous) return;
        
        await previous.message.delete();
    } catch(error) {}
}

export const getMonster = () => {
    const item = monsters.getItem(TICKET);

    if (!item) return;

    clearInterval(item.timer);

    return item.monster;
};

const buildEmbed = (monster: Monster) => {
    const embed = new EmbedBuilder()
        .setColor(monster.color as ColorResolvable)
        .setDescription(`A level ${monster.level} ${monster.name} appears!`)
        .setTitle(monster.rank === MONSTER_RANK.boss ? '**BOSS ATTACK**' : '**MONSTER ATTACK**')
        .setThumbnail(`${MONSTER_DB}/${monster.id}.png`);

    return { embeds: [embed] };
};

export const spawnMonster = async (channel: TextChannel) => {
    const timer = setInterval(async () => {
        const monster = await pickMonster();
        const embed = buildEmbed(monster);

        await cleanPrevious();

        const message = await channel.send(embed);

        monsters.addItem(TICKET, { message, monster, timer });
    }, COOL_DOWN);
};

export const stopSpawner = async () => {
    const item = monsters.getItem(TICKET);

    if (!item) return;

    clearInterval(item.timer);

    monsters.deleteItem(TICKET);
}