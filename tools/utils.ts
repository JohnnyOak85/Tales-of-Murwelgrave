import moment from 'moment';
import { LEVEL_CONTROL } from '../configurations/main.config';

export const getDate = (date = new Date(), timeFormat = 'Do MMMM YYYY, h:mm:ss a') =>
    moment(date).format(timeFormat);

const checkControl = (level: number) => level * LEVEL_CONTROL + (level - 1) * LEVEL_CONTROL;

export const getRandom = (max = 100, min = 1) => Math.floor(Math.random() * (max - min + 1) + min);
export const increment = (num: number, toInc: number) =>
    num >= checkControl(toInc) ? toInc + 1 : toInc;
export const getBool = () => Math.random() < 0.5;

export const checkRepeats = (str: string) =>
    str.length === (str.match(new RegExp(str[0], 'g')) || []).length;
