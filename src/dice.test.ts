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
    expect(k6.size).toBe(6);
  });

  test('Can be k10 dice', () => {
    const k6 = createDice({ size: 10 });
    expect(k6.size).toBe(10);
  });

  test.each`
    params            | error
    ${{ size: -1 }}   | ${'Dice will not fly with this size'}
    ${{ size: 4.5 }}  | ${'Dice will not fly with this size'}
    ${{ size: -4.5 }} | ${'Dice will not fly with this size'}
    ${{ size: '6' }}  | ${'Dice will not fly with this size'}
    ${{ size: null }} | ${'Dice will not fly with this size'}
    ${{ size: NaN }}  | ${'Dice will not fly with this size'}
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
      const dice = createDice({ size });
      expect(() => dice.roll(number)).toThrowError('Dice will not roll');
    },
  );

  test.each`
    name           | size
    ${'coin flip'} | ${2}
    ${'k3'}        | ${3}
    ${'k4'}        | ${4}
    ${'k8'}        | ${8}
    ${'k10'}       | ${10}
    ${'k20'}       | ${20}
    ${'k100'}      | ${100}
  `('Produce good ranges for $name', ({ size }) => {
    const dice = createDice({ size });
    const bucketSize = 1000;
    const totalRolls = size * bucketSize;
    const step = 1 / (totalRolls + 1);
    const rolls = range(totalRolls)
      .map((n) => (n + 1) * step)
      .map(dice.roll)
      .reduce((o, n) => {
        o[n - 1] = Number(o[n - 1] || 0) + 1;
        return o;
      }, [] as number[]);

    expect(rolls).toEqual(range(size).fill(bucketSize));
  });
});
