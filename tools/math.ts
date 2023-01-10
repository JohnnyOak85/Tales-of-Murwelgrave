export const getRandom = (max = 100, min = 1) => Math.floor(Math.random() * (max - min + 1) + min);
export const getBool = () => Math.random() < 0.5;

export const multiply = (multiplicant: number, multiplier = 2) => multiplicant * multiplier;
export const divide = (dividend: number, divisor = 2) => dividend / divisor;

export const roundDown = (number: number) => Math.floor(Math.max(0, number));
