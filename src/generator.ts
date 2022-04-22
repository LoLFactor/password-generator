import { RNG } from './rng';

const LOWERCASE_ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_ALPHA = LOWERCASE_ALPHA.toUpperCase();
const NUMERIC = '0123456789';
const SYMBOLS = '~!@#$%^&*()-=[];\'\\,./_+{}:"|<>?';

class PasswordGenerator {
  public static readonly DEFAULT_ALPHABETS = [LOWERCASE_ALPHA, UPPERCASE_ALPHA, NUMERIC, SYMBOLS];

  constructor(
    protected alphabets: string[] = PasswordGenerator.DEFAULT_ALPHABETS,
    protected rng = new RNG(),
  ) {}

  public getAlphabetCount(): number {
    return this.alphabets.length;
  }

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
}

export { PasswordGenerator };
