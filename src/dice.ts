import { assert, assertNumberBetween, assertPositiveInteger } from './assert';
import { clamp, scale } from './math';

const { ceil } = Math;

export const createDice = ({ min = 1, max = 6 } = {}) => {
  assertPositiveInteger(min, 'Cannot create dice. "min"');
  assertPositiveInteger(max, 'Cannot create dice. "max"');
  assert(min < max, 'Cannot create dice. "min" must be smaller that "max"');

  return {
    min,
    max,
    roll(n: number) {
      assertNumberBetween(n, 0, 1, 'n', 'Dice will not roll');
      return clamp(ceil(scale(n, min, max)), min, max);
    },
  } as const;
};
