import { createDice } from './dice';
import { Fortune, fortuneForDice } from './utils/fortune';
import { range } from './utils/collection';

const createRuleset = ({
  hardness = 1,
  difficulty = 2,
  dice = createDice({ size: 2 }),
  diceCount = 1,
} = {}) => {
  return {
    hardness,
    difficulty,
    dice,
    diceCount,
    check(fortune: Fortune) {
      return {
        success:
          range(diceCount)
            .map(() => dice.roll(fortune()))
            .filter((n) => n >= difficulty).length >= hardness,
      };
    },
  };
};

const k2 = createDice({ size: 2 });

describe('Ruleset', () => {
  test('default ruleset is coin flip', () => {
    const ruleset = createRuleset();
    const rolls = fortuneForDice(k2);

    expect(ruleset.hardness).toBe(1);
    expect(ruleset.difficulty).toBe(2);
    expect(ruleset.dice.size).toBe(2);
    expect(ruleset.diceCount).toBe(1);
    expect(ruleset.check(rolls(1)).success).toBe(false);
    expect(ruleset.check(rolls(2)).success).toBe(true);
  });

  test.each`
    diceCount | hardness | rolls        | isSuccessful
    ${2}      | ${0}     | ${[1, 1]}    | ${true}
    ${2}      | ${0}     | ${[1, 2]}    | ${true}
    ${2}      | ${0}     | ${[2, 1]}    | ${true}
    ${2}      | ${0}     | ${[2, 2]}    | ${true}
    ${2}      | ${1}     | ${[1, 1]}    | ${false}
    ${2}      | ${1}     | ${[1, 2]}    | ${true}
    ${2}      | ${1}     | ${[2, 1]}    | ${true}
    ${2}      | ${1}     | ${[2, 2]}    | ${true}
    ${2}      | ${2}     | ${[1, 1]}    | ${false}
    ${2}      | ${2}     | ${[1, 2]}    | ${false}
    ${2}      | ${2}     | ${[2, 1]}    | ${false}
    ${2}      | ${2}     | ${[2, 2]}    | ${true}
    ${2}      | ${3}     | ${[2, 2]}    | ${false}
    ${3}      | ${3}     | ${[1, 2, 2]} | ${false}
    ${3}      | ${3}     | ${[2, 2, 2]} | ${true}
  `(
    'no.$# Coin flip isSuccessful=$isSuccessful for {diceCount: $diceCount, hardness: $hardness, rolls: $rolls}',
    ({ diceCount, hardness, rolls, isSuccessful }) => {
      const ruleset = createRuleset({
        hardness,
        diceCount,
      });
      const _rolls = fortuneForDice(k2);

      expect(ruleset.hardness).toBe(hardness);
      expect(ruleset.difficulty).toBe(2);
      expect(ruleset.dice.size).toBe(2);
      expect(ruleset.diceCount).toBe(diceCount);
      expect(ruleset.check(_rolls(...rolls)).success).toBe(isSuccessful);
    },
  );
});
