export function addThousandsSeparator(
  n: string | number,
  thousandsSeparatorSymbol: string,
) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparatorSymbol);
}
