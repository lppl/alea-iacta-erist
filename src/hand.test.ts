import { createDice } from './dice';
import { knownFortune } from './utils/fortune';
import { createHand } from './hand';

describe('Hand', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('hand creation', () => {
    const k6 = createDice();
    const hand = createHand({ dices: [k6, k6, k6, k6] });
    expect(hand.roll(knownFortune(0, 0.49, 0.51, 1))).toEqual([1, 3, 4, 6]);
  });
});
