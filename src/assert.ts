const { round } = Math;

const enum AssertMessages {
  IsNumber = '{name} := {n} is invalid Number',
  IsNumberBetween = '{name} := {n} is not between {min} and {max}',
}

const interpolate = (
  msg: string,
  data: Record<string, string | number | boolean | undefined | null>,
) => {
  const { insight, ...params } = data;
  const message = Object.entries(params).reduce<string>(
    (str, [k, v]) => str.replace(`{${k}}`, JSON.stringify(v)),
    msg,
  );

  return [insight, message].filter(Boolean).join();
};

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

export const assertNumber = (n: number, name: string, insight?: string) => {
  assert(
    Number(n) === n,
    interpolate(AssertMessages.IsNumber, { n, name, insight }),
  );
};

export const assertNumberBetween = (
  n: number,
  min: number,
  max: number,
  name: string,
  insight?: string,
) => {
  assertNumber(n, name, insight);
  assert(
    n >= min && n <= max,
    interpolate(AssertMessages.IsNumberBetween, {
      n,
      name,
      insight,
      min,
      max,
    }),
  );
};
