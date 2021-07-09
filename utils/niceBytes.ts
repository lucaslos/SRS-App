const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function niceBytes(x: number) {
  let l = 0;
  let n = parseInt((x as unknown) as string, 10) || 0;

  while (n >= 1024 && ++l) {
    n /= 1024;
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}
