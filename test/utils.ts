export const TESTING_ROUNDS = parseInt(process.env.PASSWORD_GENERATOR_TESTING_ROUNDS, 10) || 10000;

export class PasswordChecker {
  constructor(protected alphabets: string[]) {}

  public respectsDistribution(password: string, distribution: number[]): boolean {
    // The password respects the distribution is it contains the specified number of characters from each alphabet
    return this.alphabets.reduce((isValid, alphabet, alphabetIndex) => {
      return isValid && this.containsCountOfAlphabet(password, distribution[alphabetIndex], alphabet);
    }, true);
  }

  protected containsCountOfAlphabet(password: string, count: number, alphabet: string): boolean {
    // Split password into characters
    const characters = password.split('');

    // Obtain count of character in password from this alphabet
    const actualCount = characters.reduce((actualCount, character) => {
      return actualCount + (alphabet.indexOf(character) > -1 ? 1 : 0);
    }, 0);

    return count === actualCount;
  }
}
