import {
  assertIsInteger,
  assertIsPositive,
  assertNumberBetween,
} from './assert';
import { clamp, scale } from './math';

const { ceil } = Math;

export const createDice = ({ size = 6 } = {}) => {
  assertIsInteger(size, 'size', 'Dice will not fly with this size');
  assertIsPositive(size, 'size', 'Dice will not fly with this size');

  return {
    size,
    roll(n: number) {
      assertNumberBetween(n, 0, 1, 'n', 'Dice will not roll');
      return clamp(ceil(scale(n, 1, size)), 1, size);
    },
  } as const;
};
