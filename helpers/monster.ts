import { ColorResolvable, TextChannel } from 'discord.js';
import { CollectionFactory as Collection } from '../tools/collection.factory';
import { Duelist } from './interfaces';
import { ensurePlayer } from './player';
import { buildEmbed } from '../tools/embed';
import { startRounds } from './duel';
import { BASE_URL } from '../configurations/monster.config';
import { clearMessage } from './message';
import { pickMonster } from './monster.factory';
import { addBattle, isBattling } from './battle';

const monsters = new Collection<{
    id: string;
    monster: Duelist;
    timer: NodeJS.Timeout;
}>();

const cleanUpDuel = (name: string) => {
    const timer = monsters.getItem(name)?.timer;

    if (timer) {
        monsters.clearTimer(name, timer);
    }
};

export const spawnMonster = async (channel: TextChannel) => {
    const timer = setInterval(async () => {
        const monster = pickMonster(channel.name);

        const embed = buildEmbed({
            color: monster.color as ColorResolvable,
            description: `A level ${monster.level} ${monster.name} appears!`,
            title: monster.rank === 4 ? '**BOSS ATTACK**' : '**MONSTER ATTACK**',
            thumb: `${BASE_URL}/${monster.id}.png`
        });

        clearMessage(
            [...channel.messages.cache.values()],
            monsters.getItem(channel.name)?.id || ''
        );

        const id = (await channel.send({ embeds: [embed] })).id;

        monsters.addItem(channel.name, { monster, timer, id });
    }, 90000);
};

export const engageMonster = async (channel: TextChannel, challengerId: string) => {
    if (isBattling(challengerId)) {
        return;
    }

    const monster = monsters.getItem(channel.name)?.monster;
    const challenger = await ensurePlayer(channel.guild.id, challengerId);

    cleanUpDuel(channel.name);
    addBattle(challengerId, challengerId);

    if (!monster || !challenger) return;

    monster.luck = monster.luck || 1;

    startRounds(challenger, monster, channel);
    spawnMonster(channel);
};
