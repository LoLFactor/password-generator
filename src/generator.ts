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
    const characters: string[] = [];

    while (characters.length < length) {
      const alphabetIndex = this.rng.generateInteger(0, this.getAlphabetCount());
      const alphabet = this.alphabets[alphabetIndex];
      const element = alphabet[this.rng.generateInteger(0, alphabet.length)];

      characters.push(element);
    }

    return characters.join('');
  }
}

export { PasswordGenerator };
