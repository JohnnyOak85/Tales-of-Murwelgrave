import { WORDS } from '../configurations/raffle.config';
import { CollectionFactory as Collection } from '../tools/collection.factory';
import { getRandom } from '../tools/utils';

const tickets = new Collection<{
  ticket: string,
  timer: NodeJS.Timeout;
}>();

export const startRaffle = () => {
  const timer = setInterval(() => {
    tickets.addItem('raffle', {
      ticket: WORDS[getRandom(WORDS.length) - 1],
      timer
    })
  }, 86400000);
}

export const checkWord = (words: string[]) => {
  const draw = tickets.getItem('raffle');

  for (const word of words) {
    if (draw?.ticket === word) {
      startRaffle();
      return true
    }
  }

  return false;
}
