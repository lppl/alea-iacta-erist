import { createDice } from './dice';
import { Fortune, fortuneForDice } from './utils/fortune';

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
        success: dice.roll(fortune()) >= difficulty,
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
});
