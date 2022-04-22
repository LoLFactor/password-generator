import { PasswordGenerator } from './generator';
import { RNG } from './rng';

describe('PasswordGenerator', () => {
  it('instantiates with defaults', () => {
    const generator = new PasswordGenerator();

    expect.assertions(1);

    expect(generator).toBeInstanceOf(PasswordGenerator);
  });

  it('instantiates with custom alphabets', () => {
    const generator = new PasswordGenerator(['letters', '0123456789']);

    expect.assertions(1);

    expect(generator).toBeInstanceOf(PasswordGenerator);
  });

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
});