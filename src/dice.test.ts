import { createDice } from './dice';

const range = (n = 6) => Array.from(Array(n)).map((_n, i) => i);

describe('Dice', () => {
  beforeEach(() => {
    jest.spyOn(console, 'assert');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('By default is k6 dice', () => {
    const k6 = createDice();
    expect(k6.min).toBe(1);
    expect(k6.max).toBe(6);
  });

  test('Can be k10 dice', () => {
    const k6 = createDice({ min: 1, max: 10 });
    expect(k6.min).toBe(1);
    expect(k6.max).toBe(10);
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

  test.each`
    number       | size
    ${-1000}     | ${10}
    ${-0.01}     | ${10}
    ${10.01}     | ${10}
    ${10000}     | ${10}
    ${undefined} | ${10}
    ${null}      | ${10}
    ${'0.5'}     | ${10}
  `(
    'Does complain about incorrect roll input like: $number for k$size dice',
    ({ number, size }) => {
      const dice = createDice({ min: 1, max: size });
      expect(() => dice.roll(number)).toThrowError('Dice will not roll');
    },
  );

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
    const step = 1 / (totalRolls + 1);
    const rolls = range(totalRolls)
      .map((n) => (n + 1) * step)
      .map(dice.roll)
      .reduce((o, n) => {
        o[n - 1] = Number(o[n - 1] || 0) + 1;
        return o;
      }, [] as number[]);

    expect(rolls).toEqual(range(sides).fill(bucketSize));
  });
});
