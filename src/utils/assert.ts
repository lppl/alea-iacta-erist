const enum AssertMessages {
  IsInteger = '{name} := {n} is not Integer',
  IsPositive = '{name} := {n} is not Positive',
  IsNumber = '{name} := {n} is invalid Number',
  IsNumberBetween = '{name} := {n} is not between {min} and {max}',
}

const interpolate = (
  msg: string,
  data: Record<string, string | number | boolean | undefined | null | unknown>,
) => {
  const { insight, ...params } = data;
  const message = Object.entries(params).reduce<string>(
    (str, [k, v]) => str.replace(`{${k}}`, JSON.stringify(v)),
    msg,
  );

  return [insight, message].filter(Boolean).join();
};

export const assert = (predicate: boolean, msg: string) => {
  if (!predicate) {
    throw new Error(msg);
  }
};

export const assertIsNumber = (n: unknown, name: string, insight?: string) => {
  assert(
    typeof n === 'number' && !Number.isNaN(n),
    interpolate(AssertMessages.IsNumber, { n, name, insight }),
  );
};

export const assertIsInteger = (n: number, name: string, insight?: string) => {
  assertIsNumber(n, name, insight);
  assert(
    Number.isSafeInteger(n),
    interpolate(AssertMessages.IsInteger, { n, name, insight }),
  );
};

export const assertIsPositive = (n: number, name: string, insight?: string) => {
  assertIsNumber(n, name, insight);
  assert(n > 0, interpolate(AssertMessages.IsPositive, { n, name, insight }));
};

export const assertNumberBetween = (
  n: number,
  min: number,
  max: number,
  name: string,
  insight?: string,
) => {
  assertIsNumber(n, name, insight);
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
