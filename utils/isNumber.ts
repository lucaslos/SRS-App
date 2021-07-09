export function isNumber(num: any) {
  const str = `${num}`;
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}
