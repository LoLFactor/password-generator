import { RNG } from './';
import { TESTING_ROUNDS } from '../test/utils';

describe('RNG', () => {
  it('instantiates with a default', () => {
    const rng = new RNG();

    expect.assertions(1);

    expect(rng).toBeInstanceOf(RNG);
  });

  it('instantiates with a custom generator', () => {
    const rng = new RNG((min, max) => min + max);

    expect.assertions(1);

    expect(rng).toBeInstanceOf(RNG);
  });

  describe('generateInteger(minInclusive: number, maxExclusive: number): number', () => {
    it('generates random integers using the default function', () => {
      const rng = new RNG();

      expect.assertions(TESTING_ROUNDS * 2 + 1);

      expect(typeof rng.generateInteger(0, 5)).toBe('number');
      for (let i = 0; i < TESTING_ROUNDS; i++) {
        expect(rng.generateInteger(-20, 30)).toBeGreaterThanOrEqual(-20);
        expect(rng.generateInteger(-20, 30)).toBeLessThan(30);
      }
    });

    it('generates random integers using the supplied function', () => {
      const generator = jest.fn((min: number, max: number) => min + max);
      const rng = new RNG(generator);
      const integer = rng.generateInteger(-20, 30);

      expect.assertions(2);

      expect(generator).toBeCalledWith(-20, 30);
      expect(integer).toBe(10);
    });
  });

  describe('generateDistribution(totalLength: number, elementCount: number, atLeastOneOfEach = false): number[]', () => {
    const rng = new RNG();

    it('returns the correct number of integers', () => {
      const result = rng.generateDistribution(10, 5);

      expect.assertions(3);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
      expect(result.reduce((isInteger, count) => {
        return isInteger && (typeof count === 'number' && Math.floor(count) === count);
      }, true)).toBe(true);
    });

    it('returns integers whose sum is equal to totalLength', () => {
      expect.assertions(TESTING_ROUNDS);

      for (let round = 0; round < TESTING_ROUNDS; round++) {
        const totalLength = Math.floor(Math.random() * 100) + 1;
        const elementCount = Math.floor(Math.random() * Math.min(20, totalLength)) + 1;
        const result = rng.generateDistribution(totalLength, elementCount);

        expect(result.reduce((sum, count) => sum + count, 0)).toBe(totalLength);
      }
    });

    it('optionally return an array of integers with no zeroes', () => {
      expect.assertions(TESTING_ROUNDS);

      for (let round = 0; round < TESTING_ROUNDS; round++) {
        const totalLength = Math.floor(Math.random() * 100) + 1;
        const elementCount = Math.floor(Math.random() * Math.min(20, totalLength)) + 1;
        const result = rng.generateDistribution(totalLength, elementCount, true);

        expect(result.some((count) => count === 0)).toBe(false);
      }
    });
  });
});
