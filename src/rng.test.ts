import { RNG } from './';

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
    const ROUNDS = 10000;

    it('generates random integers using the default function', () => {
      const rng = new RNG();

      expect.assertions(ROUNDS * 2 + 1);

      expect(typeof rng.generateInteger(0, 5)).toBe('number');
      for (let i = 0; i < ROUNDS; i++) {
        expect(rng.generateInteger(-20, 30)).toBeGreaterThanOrEqual(-20);
        expect(rng.generateInteger(-20, 30)).toBeLessThan(30);
      }
    });
  });

  describe('generateDistribution(totalLength: number, elementCount: number, atLeastOneOfEach = false): number[]', () => {
    const rng = new RNG();
    const ROUNDS = 10000;

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
      expect.assertions(ROUNDS);

      for (let round = 0; round < ROUNDS; round++) {
        const totalLength = Math.floor(Math.random() * 100) + 1;
        const elementCount = Math.floor(Math.random() * Math.min(20, totalLength)) + 1;
        const result = rng.generateDistribution(totalLength, elementCount);

        expect(result.reduce((sum, count) => sum + count, 0)).toBe(totalLength);
      }
    });

    it('optionally return an array of integers with no zeroes', () => {
      expect.assertions(ROUNDS);

      for (let round = 0; round < ROUNDS; round++) {
        const totalLength = Math.floor(Math.random() * 100) + 1;
        const elementCount = Math.floor(Math.random() * Math.min(20, totalLength)) + 1;
        const result = rng.generateDistribution(totalLength, elementCount, true);

        expect(result.some((count) => count === 0)).toBe(false);
      }
    });
  });
});
