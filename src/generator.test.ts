import { PasswordGenerator, RNG } from './';
import { PasswordChecker, TESTING_ROUNDS } from '../test/utils';

describe('PasswordGenerator', () => {
  it('instantiates with defaults', () => {
    const generator = new PasswordGenerator();

    expect.assertions(1);

    expect(generator).toBeInstanceOf(PasswordGenerator);
  });

  // TODO: Handle empty array
  it('instantiates with custom alphabets', () => {
    const generator = new PasswordGenerator(['letters', '0123456789']);

    expect.assertions(1);

    expect(generator).toBeInstanceOf(PasswordGenerator);
  });

  // TODO: Handle incorrect class
  it('instantiates with custom alphabets and a custom RNG class', () => {
    const generator = new PasswordGenerator(['letters', '0123456789'], new RNG((min: number, max: number) => min + max));

    expect.assertions(1);

    expect(generator).toBeInstanceOf(PasswordGenerator);
  });

  it('can correctly retrieve the number of alphabets it has', () => {
    expect.assertions(2);

    expect((new PasswordGenerator()).getAlphabetCount()).toBe(PasswordGenerator.DEFAULT_ALPHABETS.length);
    expect((new PasswordGenerator(['letters'])).getAlphabetCount()).toBe(1);

  });

  describe('generate(length: number, distribution: number[]): string', () => {
    const generator = new PasswordGenerator();

    it('generates passwords of default length (16)', () => {
      const password = generator.generate();

      expect.assertions(2);

      expect(typeof password).toBe('string');
      expect(password.length).toBe(16);
    });

    it('generates passwords of the correct length', () => {
      const password = generator.generate(1337);

      expect.assertions(1);

      expect(password.length).toBe(1337);
    });

    it('generates unique passwords', () => {
      const passwords: string[] = [];
      for (let i = 0; i < TESTING_ROUNDS; i++) {
        passwords.push(generator.generate());
      }

      expect.assertions(1);

      // Expect all generated passwords to have their own index -> be unique
      expect(passwords.some((password, index, array) => index !== array.indexOf(password))).toBe(false);
    });

    // TODO: Handle empty supplied distribution
    it('generates passwords that respect the supplied distribution', () => {
      const rng = new RNG();
      const generator = new PasswordGenerator(PasswordGenerator.DEFAULT_ALPHABETS);
      const checker = new PasswordChecker(PasswordGenerator.DEFAULT_ALPHABETS);

      expect.assertions(TESTING_ROUNDS);

      for (let i = 0; i < TESTING_ROUNDS; i++) {
        const length = rng.generateInteger(15, 100);
        const distribution = rng.generateDistribution(length, generator.getAlphabetCount());
        const password = generator.generate(length, distribution);

        expect(checker.respectsDistribution(password, distribution)).toBe(true);
      }
    });
  });

  describe('generateWithAllAlphabets(length: number, distribution: number[]): string', () => {
    const generator = new PasswordGenerator();

    it('generates passwords of default length (16)', () => {
      const password = generator.generateWithAllAlphabets();

      expect.assertions(2);

      expect(typeof password).toBe('string');
      expect(password.length).toBe(16);
    });

    it('generates passwords of the correct length', () => {
      const password = generator.generateWithAllAlphabets(1337);

      expect.assertions(1);

      expect(password.length).toBe(1337);
    });

    it('generates passwords using at least one character from each alphabet', () => {
      const checker = new PasswordChecker(PasswordGenerator.DEFAULT_ALPHABETS);

      expect.assertions(TESTING_ROUNDS);

      for (let i = 0; i < TESTING_ROUNDS; i++) {
        const password = generator.generateWithAllAlphabets(generator.getAlphabetCount());

        expect(checker.usesAllAlphabets(password)).toBe(true);
      }
    });
  });
});
