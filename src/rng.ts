function generateSeeds(totalLength: number, seedCount: number, generator: IntegerGenerator): number[] {
  const seeds = [];

  // Add random number between 0 and totalLength (inclusive) to array
  for (let i = 0; i < seedCount; i++) {
    seeds.push(generator(0, totalLength + 1));
  }

  return seeds;
}

function generateNonZeroSeeds(totalLength: number, seedCount: number, generator: IntegerGenerator): number[] {
  const seeds = [];

  // We change the logic here.
  // Since the generation of individual element counts is a function of differences between two numbers,
  // we need to generate unique numbers. That way, no difference between any 2 of them will ever be less than 1.
  while (seeds.length < seedCount) {
    // Generate a number between 1 (inclusive) and totalLength (exclusive)
    const seed = generator(1, totalLength);

    // If it's already in the array, try again
    if (seeds.indexOf(seed) > -1) {
      continue;
    }

    // Else push it to the array
    seeds.push(seed);
  }

  return seeds;
}

type IntegerGenerator = (minInclusive: number, maxExclusive: number) => number;

/**
 * Default random number generator. Here for convenience.
 * Can (and should) be replaced with something like randomInt from the crypto package.
 * In actual fact, it's based on the behaviour of the that same function.
 *
 * @param minInclusive Minimum integer to generate (inclusive).
 * @param maxExclusive Maximum integer to generate (exclusive).
 *
 * @return A number x, where minInclusive <= x < maxExclusive.
 */
function mathJsIntGenerator(minInclusive: number, maxExclusive: number): number {
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

class RNG {
  /**
   *
   * @param generator A random integer generator function. Defaults to a convenience function. Should be replaced with something better.
   */
  constructor(protected generator: IntegerGenerator = mathJsIntGenerator) {}

  /**
   * Proxy function. Uses the generator supplied to the constructor.
   *
   * @param minInclusive Minimum integer to generate (inclusive).
   * @param maxExclusive Maximum integer to generate (exclusive).
   *
   * @return A number x, where minInclusive <= x < maxExclusive.
   */
  public generateInteger(minInclusive: number, maxExclusive: number): number {
    return this.generator(minInclusive, maxExclusive);
  }

  /**
   * Given a total length and the number of elements to select from, returns an array containing the counts for each
   * element, totaling the length.
   *
   * @param totalLength The sum of all the counts.
   * @param elementCount The number of elements to generate counts for.
   * @param atLeastOneOfEach Whether all counts should be greater than 0.
   */
  public generateDistribution(totalLength: number, elementCount: number, atLeastOneOfEach = false): number[] {
    // Create "seeds" for the following process
    const seeds = atLeastOneOfEach ?
      generateNonZeroSeeds(totalLength, elementCount - 1, this.generator) :
      generateSeeds(totalLength, elementCount - 1, this.generator);

    // Sort the seeds so that the final array is also sorted
    seeds.sort((a, b) => a - b);

    // Init working array with 0, the "seeds" and totalLength
    const counts = [0, ...seeds, totalLength];

    // Now make every element except the last one equal the difference between the next element and itself.
    // Since we ordered them, this will always result in a number >= 0 (or > 0 if atLeastOneOfEach is true).
    for (let i = 0; i < elementCount; i++) {
      counts[i] = counts[i + 1] - counts[i];
    }

    // Return the whole array, except the last element (totalLength itself).
    // By the magic of math, this process will always result in an array with the length of elementCount whose sum is totalLength.
    return counts.slice(0, -1);
  }
}

export { mathJsIntGenerator, RNG };
