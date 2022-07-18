import { Dice } from './dice';

export function createHand({ dices }: { dices: Dice[] }) {
  return {
    roll(fortune: () => number) {
      return dices.map((dice) => dice.roll(fortune()));
    },
  };
}
