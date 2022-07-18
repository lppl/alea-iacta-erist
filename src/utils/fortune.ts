import { clamp } from './math';
import { Dice } from '../dice';

declare const validFortune: unique symbol;

export type FortuneCast = number & { [validFortune]: true };
export type Fortune = () => FortuneCast;

export const fortunate = (n: number) => clamp(n, 0, 1) as FortuneCast;

export const isFortune = (n: unknown): n is FortuneCast =>
  typeof n == 'number' && 0 <= n && n <= 1;

export const randomFortune: () => FortuneCast = () =>
  Math.random() as FortuneCast;

export const knownFortune = (...roll: number[]) => {
  let i = -1;
  return () => {
    i += 1;
    if (typeof roll[i] === undefined) {
      throw new Error(`We have no more rolls 😢 for roll ${i}`);
    }
    return fortunate(roll[i]);
  };
};

export const fortuneForDice =
  ({ size }: Dice) =>
  (...roll: number[]): Fortune => {
    let i = -1;
    return () => {
      i += 1;
      if (typeof roll[i] === undefined) {
        throw new Error(`We have no more rolls 😢 for roll ${i}`);
      }
      return fortunate((roll[i] - 0.5) / size);
    };
  };
