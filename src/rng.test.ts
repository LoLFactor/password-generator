import { RNG } from './';

describe('RNG', () => {
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
