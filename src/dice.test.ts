import { createDice } from './dice';
import { range } from './utils/collection';

describe('Dice creation and rolling issues', () => {
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
});

describe.each`
  name                 | size
  ${'k2 or coin flip'} | ${2}
  ${'k3'}              | ${3}
  ${'k4'}              | ${4}
  ${'k6'}              | ${6}
  ${'k8'}              | ${8}
  ${'k10'}             | ${10}
  ${'k20'}             | ${20}
  ${'k100'}            | ${100}
`('rolled values for $name', ({ size }) => {
  const dice = createDice({ size });

  const smallestRoll = 0;
  const highestRoll = 1;
  const iDontCareAboutFloatPointEdgeCases = 1e-10;

  test('rolls right smallestRoll', () => {
    expect(dice.roll(smallestRoll)).toBe(1);
  });

  test('rolls right highestRoll', () => {
    expect(dice.roll(highestRoll)).toBe(size);
  });

  test.each(range(size).slice(1))(
    'rolls right on its %s breakpoint',
    (breakpoint) => {
      const breakpointRoll = breakpoint / size;
      expect(
        dice.roll(breakpointRoll - iDontCareAboutFloatPointEdgeCases),
      ).toBe(breakpoint);
      expect(
        dice.roll(breakpointRoll + iDontCareAboutFloatPointEdgeCases),
      ).toBe(breakpoint + 1);
    },
  );
});
