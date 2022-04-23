import { RNG } from './rng';

const LOWERCASE_ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_ALPHA = LOWERCASE_ALPHA.toUpperCase();
const NUMERIC = '0123456789';
const SYMBOLS = '~!@#$%^&*()-=[];\'\\,./_+{}:"|<>?';

class PasswordGenerator {
  /**
   * Default alphabets used byt the password generator.
   * Includes lowercase alpha characters, uppercase alpha characters, numbers and symbols.
   */
  public static readonly DEFAULT_ALPHABETS = [LOWERCASE_ALPHA, UPPERCASE_ALPHA, NUMERIC, SYMBOLS];

  /**
   * Main class of the package.
   * Generates passwords according to the supplied parameters (or default ones if not specified) and using the supplied
   * RNG class (or a default one is not specified).
   *
   * @param alphabets Array of strings comprising the alphabets from which to pick characters for password generation. Defaults to {@link PasswordGenerator.DEFAULT_ALPHABETS}.
   * @param rng RNG class to be used for password generation. Defaults to a default {@link RNG} class using a JS Math implementation.
   *
   * @see PasswordGenerator.DEFAULT_ALPHABETS
   * @see RNG
   */
  constructor(
    protected alphabets: string[] = PasswordGenerator.DEFAULT_ALPHABETS,
    protected rng = new RNG(),
  ) {}

  /**
   * Retrieves the number of alphabets used by this password generator.
   * Useful when creating custom distributions.
   *
   * @see RNG.generateDistribution
   */
  public getAlphabetCount(): number {
    return this.alphabets.length;
  }

  /**
   * The main method of the class.
   * Generates a password of the specified length and using the supplied distribution (or a default one if not specified).
   *
   * @param length The length of the generated password. Defaults to 16.
   * @param distribution An array of integers which control how many characters from each alphabet are picked. Defaults to a completely random distribution that does not guarantee the presence of all alphabets.
   *
   * @see RNG.generateDistribution
   */
  public generate(
    length: number = 16,
    distribution: number[] = this.rng.generateDistribution(length, this.getAlphabetCount()),
  ): string {
    // The elements that will make up the password
    const characters: string[] = [];
    // Create a copy of the distribution, since we need to alter it
    const workingDistribution = [...distribution];

    while (characters.length < length) {
      // Roll the dice which alphabet should be used for this character
      const alphabetIndex = this.rng.generateInteger(0, this.getAlphabetCount());

      // If that alphabet has already been used up for this password, skip ahead to the next iteration
      if (workingDistribution[alphabetIndex] === 0) {
        continue;
      }

      // If it hasn't, get the alphabet
      const alphabet = this.alphabets[alphabetIndex];
      // Roll the dice which character of the alphabet should be used
      const element = alphabet[this.rng.generateInteger(0, alphabet.length)];

      // Add the character to the password
      characters.push(element);
      // And decrease this alphabet's character distribution count by 1
      workingDistribution[alphabetIndex]--;
    }

    return characters.join('');
  }

  /**
   * Generate a password using at least one character from each of the registered alphabets.
   *
   * @param length The length of the generated password. Defaults to 16.
   */
  public generateWithAllAlphabets(length: number = 16): string {
    const distribution = this.rng.generateDistribution(length, this.getAlphabetCount(), true);

    return this.generate(length, distribution);
  }
}

export { PasswordGenerator };
