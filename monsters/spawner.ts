import { ColorResolvable, EmbedBuilder, Message, TextChannel, time } from 'discord.js';
import { MONSTER_DB } from '../config';
import { Monster } from '../interfaces';
import { MONSTER_RANK } from '../maps';
import { Collector } from '../tools/collector';
import { logError } from '../tools/logger';
import { pickMonster } from './monster.factory';

const COOL_DOWN = 30000;
const TICKET = 'current';

const timers = new Collector<NodeJS.Timeout>;
let timer: NodeJS.Timeout;
let activeMonster: {
    message: Message;
    monster: Monster;
}

const monsters = new Collector<{
    message: Message;
    monster: Monster;
    timer: NodeJS.Timeout;
}>();

const cleanPrevious = async () => {
    try {
        const item = monsters.getItem(TICKET);
        
        if (!item) return;

        console.log('CLEARING INTERVAL')
        clearInterval(item.timer);

        console.log('DELETING MESSAGE')
        await item.message.delete();

        console.log('DELETING ITEM')
        monsters.deleteItem(TICKET);
    } catch(error) {
        logError(error, 'cleanPrevious');
    }
}

// export const getMonster = () => {
//     const item = monsters.getItem(TICKET);

//     if (!item) return;

//     clearInterval(item.timer);
    
//     monsters.deleteItem(TICKET);

//     return item.monster;
// };

export const getMonster = () => {
   if (timer) clearInterval(timer);

    return activeMonster?.monster;
}

const buildEmbed = (monster: Monster) => {
    const embed = new EmbedBuilder()
        .setColor(monster.color as ColorResolvable)
        .setDescription(`A level ${monster.level} ${monster.description} ${monster.name}${monster.className ? ` ${monster.className}` : ''} appears!`)
        .setTitle(monster.rank === MONSTER_RANK.boss ? '**BOSS ATTACK**' : '**MONSTER ATTACK**')
        .setThumbnail(`${MONSTER_DB}/${monster.id}.png`);

    return { embeds: [embed] };
};

// export const spawnMonster = async (channel: TextChannel) => {
//     const timer = setInterval(async () => {
//         const monster = await pickMonster();
//         const embed = buildEmbed(monster);

//         console.log('CLEANING PREVIOUS MONSTER')
//         await cleanPrevious();

//         console.log('SENDING NEW MESSAGE')
//         const message = await channel.send(embed);

//         console.log('ADDING ITEM')
//         monsters.addItem(TICKET, { message, monster, timer });
//     }, COOL_DOWN);
// };

export const spawnMonster = async (channel: TextChannel) => {
    clearInterval(timer);

    activeMonster.monster = await pickMonster();
    const embed = buildEmbed(activeMonster.monster);
    activeMonster.message.delete();
    activeMonster.message = await channel.send(embed);
    
    timer = setInterval(() => spawnMonster(channel), COOL_DOWN);
}

// export const stopSpawner = async () => {
//     const item = monsters.getItem(TICKET);

//     if (!item) return;

//     clearInterval(item.timer);

//     item.message.delete();
//     monsters.deleteItem(TICKET);
// }

export const stopSpawner = async () => {
    if (timer) clearInterval(timer);

    if (activeMonster?.message) activeMonster.message.delete();
}