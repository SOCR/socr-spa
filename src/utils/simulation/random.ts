/**
 * Mersenne Twister PRNG for reproducible simulations
 * Based on the original MT19937 algorithm
 */
export class MersenneTwister {
  private mt: number[];
  private mti: number;
  
  private static readonly N = 624;
  private static readonly M = 397;
  private static readonly MATRIX_A = 0x9908b0df;
  private static readonly UPPER_MASK = 0x80000000;
  private static readonly LOWER_MASK = 0x7fffffff;
  
  constructor(seed?: number) {
    this.mt = new Array(MersenneTwister.N);
    this.mti = MersenneTwister.N + 1;
    this.init(seed ?? Date.now());
  }
  
  init(seed: number): void {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < MersenneTwister.N; this.mti++) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + 
                           (s & 0x0000ffff) * 1812433253) + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  
  private genrandInt32(): number {
    let y: number;
    const mag01 = [0x0, MersenneTwister.MATRIX_A];
    
    if (this.mti >= MersenneTwister.N) {
      let kk: number;
      
      for (kk = 0; kk < MersenneTwister.N - MersenneTwister.M; kk++) {
        y = (this.mt[kk] & MersenneTwister.UPPER_MASK) | (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
        this.mt[kk] = this.mt[kk + MersenneTwister.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      
      for (; kk < MersenneTwister.N - 1; kk++) {
        y = (this.mt[kk] & MersenneTwister.UPPER_MASK) | (this.mt[kk + 1] & MersenneTwister.LOWER_MASK);
        this.mt[kk] = this.mt[kk + (MersenneTwister.M - MersenneTwister.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      
      y = (this.mt[MersenneTwister.N - 1] & MersenneTwister.UPPER_MASK) | (this.mt[0] & MersenneTwister.LOWER_MASK);
      this.mt[MersenneTwister.N - 1] = this.mt[MersenneTwister.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
      
      this.mti = 0;
    }
    
    y = this.mt[this.mti++];
    
    // Tempering
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);
    
    return y >>> 0;
  }
  
  /**
   * Generate random number in [0, 1)
   */
  random(): number {
    return this.genrandInt32() * (1.0 / 4294967296.0);
  }
  
  /**
   * Generate random integer in [min, max]
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
  
  /**
   * Generate random number from uniform distribution in [a, b)
   */
  uniform(a: number = 0, b: number = 1): number {
    return a + this.random() * (b - a);
  }
}

/**
 * Box-Muller transform for normal distribution sampling
 */
export function boxMullerTransform(rng: MersenneTwister): [number, number] {
  const u1 = rng.random();
  const u2 = rng.random();
  
  const r = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

/**
 * Sample from standard normal distribution N(0, 1)
 */
export function sampleStandardNormal(rng: MersenneTwister): number {
  return boxMullerTransform(rng)[0];
}

/**
 * Sample from normal distribution N(mean, std^2)
 */
export function sampleNormal(rng: MersenneTwister, mean: number, std: number): number {
  return mean + std * sampleStandardNormal(rng);
}

/**
 * Sample from Bernoulli distribution
 */
export function sampleBernoulli(rng: MersenneTwister, p: number): number {
  return rng.random() < p ? 1 : 0;
}

/**
 * Sample from binomial distribution
 */
export function sampleBinomial(rng: MersenneTwister, n: number, p: number): number {
  let successes = 0;
  for (let i = 0; i < n; i++) {
    if (rng.random() < p) successes++;
  }
  return successes;
}

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(rng: MersenneTwister, array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rng.randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
