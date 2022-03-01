import { getDoc } from '../tools/database';
import { getRandom } from '../tools/utils';

let ticket: string;
let timer: NodeJS.Timeout;

export const startRaffle = async () => {
  timer = setInterval(async () => {
    const words = await getDoc<string[]>('', 'raffle');
    ticket = words[getRandom(words.length) - 1];
  }, 86400000);
};

export const checkWord = (words: string[]) => {
  for (const word of words) {
    if (ticket && ticket === word) {
      clearTimeout(timer);
      startRaffle();

      return true;
    }
  }

  return false;
};
