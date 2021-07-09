import { clampRange } from '@utils/clamp';

type Interval = [number, number];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function cyclicLerp(
  input: number,
  [inStart, inEnd]: Interval,
  [outStart, outEnd]: Interval,
) {
  return (
    mod((input - inStart) / (inEnd - inStart), 1) * (outEnd - outStart) +
    outStart
  );
}

function findRange(input: number, inputRange: number[]) {
  for (let i = 1; i < inputRange.length - 1; i++) {
    if (inputRange[i] >= input) return i - 1;
  }

  return inputRange.length - 2;
}

export function interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  clamp = true,
) {
  if (import.meta.env.DEV) {
    if (inputRange.length !== outputRange.length) {
      throw new Error(
        'Interpolate error: Input range and output range must have the same lenght',
      );
    }
  }

  const range = findRange(input, inputRange);
  const inStart = inputRange[range];
  const inEnd = inputRange[range + 1];
  const outStart = outputRange[range];
  const outEnd = outputRange[range + 1];

  const interpolatedValue =
    ((input - inStart) / (inEnd - inStart)) * (outEnd - outStart) + outStart;

  return clamp
    ? clampRange(interpolatedValue, outStart, outEnd)
    : interpolatedValue;
}
