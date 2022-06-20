import { createDice } from './dice';

const range = (n = 6) => Array.from(Array(n)).map((_n, i) => i);

describe('Dice', () => {
  test('By default is k6 dice', () => {
    const k6 = createDice();
    expect(k6.min).toBe(1);
    expect(k6.max).toBe(6);
  });

  test.each`
    params                    | error
    ${{ min: 0.5, max: 6 }}   | ${'Cannot create dice. "min" must be positive integer'}
    ${{ min: 0.5, max: 4.5 }} | ${'Cannot create dice. "min" must be positive integer'}
    ${{ min: '1', max: 4.5 }} | ${'Cannot create dice. "min" must be positive integer'}
    ${{ min: 1, max: 4.5 }}   | ${'Cannot create dice. "max" must be positive integer'}
    ${{ min: 1, max: '6' }}   | ${'Cannot create dice. "max" must be positive integer'}
    ${{ min: -6, max: 6 }}    | ${'Cannot create dice. "min" must be positive integer'}
    ${{ min: 6, max: 1 }}     | ${'Cannot create dice. "min" must be smaller that "max"'}
    ${{ min: 1, max: 1 }}     | ${'Cannot create dice. "min" must be smaller that "max"'}
  `('Have proper parameters validation: $params', ({ params, error }) => {
    expect(() => createDice(params)).toThrowError(error);
  });

  test('Rolls with numbers between 0 and 1 ', () => {
    const k6 = createDice();
    expect(k6.roll(-100)).toBe(1);
    expect(k6.roll(-0.01)).toBe(1);
    expect(k6.roll(1.01)).toBe(6);
    expect(k6.roll(100)).toBe(6);
  });

  test.each`
    name           | sides
    ${'coin flip'} | ${2}
    ${'k3'}        | ${3}
    ${'k4'}        | ${4}
    ${'k8'}        | ${8}
    ${'k10'}       | ${10}
    ${'k20'}       | ${20}
    ${'k100'}      | ${100}
  `('Produce good ranges for $name', ({ sides }) => {
    const dice = createDice({ min: 1, max: sides });
    const bucketSize = 1000;
    const totalRolls = sides * bucketSize;
    const step = 1 / totalRolls;
    const rolls = range(totalRolls)
      .map((n) => n * step)
      .map(dice.roll)
      .reduce((o, n) => {
        o[n - 1] += 1;
        return o;
      }, range(sides).fill(0));

    expect(rolls.reduce((sum, n) => sum + n, 0)).toEqual(totalRolls);
    expect(
      rolls
        .map((count) => Math.abs(bucketSize - count))
        .filter((diff) => diff > 1),
    ).toHaveLength(0);
  });
});
