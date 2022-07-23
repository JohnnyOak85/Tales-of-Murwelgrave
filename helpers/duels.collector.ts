import { TextChannel } from 'discord.js';
import { CollectionFactory as Collection } from '../tools/collection.factory';

const duels = new Collection<{
    challenger: string;
    timer: NodeJS.Timeout;
}>();

export const cleanUpDuel = (name: string) => {
    const timer = duels.getItem(name)?.timer;

    if (timer) {
        duels.clearTimer(name, timer);
    }
};


export const isValid = (challenger: string, defender: string) => {
    if (
        duels.findItem(defender) ||
        duels.getList().find((duel) => duel.challenger === defender)
    ) {
        return 'This fighter already has an open challenge.'
    } else if (
        duels.findItem(challenger) ||
        duels.getList().find((duel) => duel.challenger === challenger)
    ) {
        return 'You already have an open challenge.'
    }

    return;
}

export const addDuel = (channel: TextChannel, challenger: string, defender: string) => {
    duels.addItem(defender, {
        challenger,
        timer: setTimeout(() => {
            duels.deleteItem(defender);
            channel.send(`<@${challenger}>'s challenge has expired!`);
        }, 300000),
    });
}

export const getDuel = (duelId: string) => duels.getItem(duelId);
