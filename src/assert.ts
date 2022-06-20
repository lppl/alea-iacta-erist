const { round } = Math;

export const softAssert = (
  predicate: boolean,
  message: string,
  ...optional: unknown[]
) => {
  console.assert(predicate, message, ...optional);
};

export const assert = (predicate: boolean, msg: string) => {
  if (!predicate) {
    throw new Error(msg);
  }
};

export const assertPositiveInteger = (n: number, name: string) => {
  const msg = `${name} must be positive integer`;
  assert(Number(n) === n, msg);
  assert(round(n) === n, msg);
  assert(n > 0, msg);
};
