<p align="center">
  <img alt="npm type definitions" src="https://img.shields.io/npm/types/@llftr/password-generator">
  <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@llftr/password-generator">
  <img alt="GitHub" src="https://img.shields.io/github/license/LoLFactor/password-generator">
  <a href="https://travis-ci.com/LoLFactor/password-generator">
    <img src="https://travis-ci.com/LoLFactor/password-generator.svg?branch=master" alt="Build status">
  </a>
  <a href="https://codecov.io/gh/LoLFactor/password-generator">
    <img src="https://codecov.io/gh/LoLFactor/password-generator/branch/master/graph/badge.svg?token=F82NHAZF3B" alt="Code coverage"/>
  </a>
</p>

# Password Generator

A Typescript library for generating passwords using configurable alphabets and a configurable distribution of said
alphabets.

## Installation

```
npm install @llftr/password-generator
```

OR

```
yarn add @llftr/password-generator
```

## Usage

For basic usage it's pretty straight forward. Just import the main class and use it to generate passwords. Here's the
TLDR version:

```typescript
import { PasswordGenerator } from '@llftr/password-generator';

const generator = new PasswordGenerator();
/*
 * Generate a 16 character password that contains any combination of the following:
 *  - lowercase alpha characters
 *  - uppercase alpha characters
 *  - digits
 *  - symbols
 */
const password = generator.generate();

/*
 * Same as above, 16 characters, but guaranteed to contain at least one of each.
 */
const secondPassword = generator.generateWithAllAlphabets();
```

The whole generation process is configurable though. For more advanced use cases, read on.

## API

Beside the main `PasswordGenerator` class, there is also the `RNG` class. We'll discuss the latter first, since the
whole generation process hinges on it.

### RNG class

```typescript
import type { IntegerGenerator } from '@llftr/password-generator';
import { RNG } from '@llftr/password-generator';

const myGenerator: IntegerGenerator = (min, max) => {
  // Your code here
};

function alsoValid(min: number, max: number): number {
  // Your code here
}

const defaultRng = new RNG();
const myCustomRng = new RNG(myGenerator);
const myOtherCustomRng = new RNG(alsoValid);
```

The RNG class constructor takes an optional `IntegerGenerator` as a parameter. This is a type alias which is defined as
such:

```typescript
type IntegerGenerator = (minInclusive: number, maxExclusive: number) => number;
```

This matches the signature of `crypto.randomInt`, which is what you should be using, if you can. Wanting this package to
also be usable on the web without having to resort to polyfills and such, the default `RNG` uses an existing convenience
function that relies on the `Math.random()` function. It's [more than sufficient](#are-the-passwords-actually-that-random-though)
for most cases.

As seen above, you can supply your own function to it, or if you want, you could just import `RNGInterface` and just
create your own custom implementation and pass that to `PasswordManager`.

```typescript
import type { RNGInterface } from '@llftr/password-generator';

class MyCustomRNG implements RNGInterface {
  public generateInteger(minInclusive: number, maxExclusive: number): number {
    // Your code here
  }

  generateDistribution(totalLength: number, elementCount: number, atLeastOneOfEach: boolean): number[] {
    // Your code here
  }
}
```

#### generateInteger(minInclusive: number, maxExclusive: number): number

This method returns a random integer in the range [minInclusive, maxExclusive). Used internally by `PasswordManager`
to pick randomly when generating the password.

#### generateDistribution(totalLength: number, elementCount: number, atLeastOneOfEach: boolean): number[]

This method creates a random distribution for use in the password generation process. It basically determines how many
characters of each alphabet are used in the generation process.

```typescript
const rng = new RNG();

/*
 * Create a distribution for password 16 characters long and using 4 alphabets (the default parameters).
 * Will return something like [2, 5, 7, 2], but also possibly [0, 3, 7, 6] or even (HIGHLY unlikely) [0, 0, 0, 16].
 */
const randomDistribution = rng.generateDistribution(16, 4);
/*
 * Same as above, but guarantees no count will be less than 1.
 */
const oneOfEachDistribution = rng.generateDistribution(16, 4, true);
```

### PasswordGenerator class

The main class of this package. It's constructor takes 2 parameters, both optional:

- `alphabets: string[]` - An array of strings from which the passwords will be generated. Defaults
  to `PasswordGenerator.DEFAULT_ALPHABETS`.
- `rng: RNG` - An `RNG` class instance. Defaults to an instance using the built-in `Math.random` method of generating
  integers.

#### DEFAULT_ALPHABETS constant

The default alphabets used are lowercase alpha, uppercase alpha, digits and symbols. You can pass in an array that adds
to this one, or a different one entirely. Whatever you want, so long as it's an array os strings.

#### getAlphabetCount(): number

This method return the number os alphabets on this particular instance. Useful for generating custom distributions.

#### public generate(length: number, distribution: number[]): string

The main method of this class. Takes a length and a distribution of alphabets as parameters. Defaults to 16 characters,
and a distribution created using the supplied `RNG` class, without passing in `atLeastOneOfEach`.

#### generateWithAllAlphabets(length: number): string

Convenience method which takes only the length (default still 16) and generates a password that is guaranteed to contain
at least one character of each alphabet. Internally it calls `RNG.generateDistribution()` with `atLeastOneOfEach`.

## Are the passwords actually that random, though?

Yes. Well, good enough. The tests I created include a uniqueness test that does 10000 rounds of generation and checks
for duplicates. In all th times I've run it, no duplicates have been found. As a goof, I decided to do a 500000
(half a million) rounds run. It took close to 10 minutes to do all the tests, but no duplicates were found.

Keep in mind this was done using the with default `Math.random()` implementation, so even in its plum stock
configuration, the library generates sufficiently random passwords. If you want super-duper randomness, just pass
`crypto.randomInt()` as the generator function to the `RNG` class.

```typescript
import { randomInt } from 'crypto';
import { RNG, PasswordGenerator } from '@llftr/password-generator';

// Now you have ALL the randomness.
// Well, cryptographically-secure instead of pseudo-random, so yeah, better.
const generator = new PasswordGenerator(PasswordGenerator.DEFAULT_ALPHABETS, new RNG(randomInt));
```

## Known limitations

Yes, there are some. Namely, I was too lazy to implement error handling for every case (as of now, anyway), which means
if you go too crazy with configurability, but don't take care that everything is correct, there will be errors.

One thing that springs to mind in particular is if you call `PasswordGenerator.generate()` with a one length and a
distribution that whose sum is less than that length (8 length and [2, 3, 2]), the process will hang.

In it's completely stock configuration everything is perfectly fine, as the tests indicate.
