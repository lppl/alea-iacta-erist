const createScale =
  (min = 0, max = 1) =>
  (n: number) =>
    (max - min + 1) * n + min - 1;

const createClamp =
  (min = 0, max = 1) =>
  (n: number) => {
    if (min > n) {
      return min;
    } else if (max < n) {
      return max;
    } else {
      return n;
    }
  };

const { round, ceil } = Math;

const softAssert = (
  predicate: boolean,
  message: string,
  ...optional: unknown[]
) => {
  console.assert(predicate, message, ...optional);
};

const assert = (predicate: boolean, msg: string) => {
  if (!predicate) {
    throw new Error(msg);
  }
};

const assertPositiveInteger = (n: number, name: string) => {
  const msg = `${name} must be positive integer`;
  assert(Number(n) === n, msg);
  assert(round(n) === n, msg);
  assert(n > 0, msg);
};

export const createDice = ({ min = 1, max = 6 } = {}) => {
  assertPositiveInteger(min, 'Cannot create dice. "min"');
  assertPositiveInteger(max, 'Cannot create dice. "max"');
  assert(min < max, 'Cannot create dice. "min" must be smaller that "max"');

  const scale = createScale(min, max);
  const clamp = createClamp(min, max);
  return {
    min,
    max,
    roll(number: number) {
      softAssert(
        number >= 0 && number <= 1,
        'Number should be between 0 and 1',
      );
      return clamp(ceil(scale(number)));
    },
  };
};
