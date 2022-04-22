export const TESTING_ROUNDS = parseInt(process.env.PASSWORD_GENERATOR_TESTING_ROUNDS, 10) || 10000;

export class PasswordChecker {
  constructor(protected alphabets: string[]) {}

  public respectsDistribution(password: string, distribution: number[]): boolean {
    // The password respects the distribution is it contains the specified number of characters from each alphabet
    return this.alphabets.reduce((isValid, alphabet, alphabetIndex) => {
      return isValid && distribution[alphabetIndex] === this.getUsedCharactersOfAlphabet(password, alphabet);
    }, true);
  }

  public usesAllAlphabets(password: string): boolean {
    // The password uses all alphabets if the character count from each is > 0
    return this.alphabets.reduce((usesAll, alphabet) => {
      return usesAll && this.getUsedCharactersOfAlphabet(password, alphabet) > 0;
    }, true);
  }

  protected getUsedCharactersOfAlphabet(password: string, alphabet: string): number {
    // Split password into characters
    const characters = password.split('');

    // Return count of characters in password from this alphabet
    return characters.reduce((actualCount, character) => {
      return actualCount + (alphabet.indexOf(character) > -1 ? 1 : 0);
    }, 0);
  }
}
