import { RaffleTicket } from '../interfaces';
import { getList } from '../storage/cache';
import { CollectionFactory as Collection } from '../tools/collection.factory';
import { getRandom } from '../tools/utils';

const TWENTY_FOUR_HOURS = 864000000;
const tickets = new Collection<RaffleTicket>();

export const startRaffle = () => {
    const timer = setInterval(async () => {
        const wordList = await getList('raffle');
        const ticket = wordList[getRandom(wordList.length) - 1];

        tickets.addItem('raffle', { ticket, timer });
    }, TWENTY_FOUR_HOURS);
};

export const checkWord = (words: string[]) => {
    const draw = tickets.getItem('raffle');

    for (const word of words) {
        if (draw?.ticket === word) {
            startRaffle();
            return true;
        }
    }

    return false;
};
