import { assert, assertPositiveInteger, softAssert } from './assert';
import { clamp, scale } from './math';

const { ceil } = Math;

export const createDice = ({ min = 1, max = 6 } = {}) => {
  assertPositiveInteger(min, 'Cannot create dice. "min"');
  assertPositiveInteger(max, 'Cannot create dice. "max"');
  assert(min < max, 'Cannot create dice. "min" must be smaller that "max"');

  return {
    min,
    max,
    roll(number: number) {
      softAssert(
        number >= 0 && number <= 1,
        'Number should be between 0 and 1',
      );
      return clamp(ceil(scale(number, min, max)), min, max);
    },
  } as const;
};
