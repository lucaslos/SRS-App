export function round(num: number, precision = 0) {
  return Math.round(num * 10 ** precision) / 10 ** precision;
}
