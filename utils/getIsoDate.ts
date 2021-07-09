export function getIsoDate(date: Date) {
  return date.toISOString().substring(0, 10);
}
