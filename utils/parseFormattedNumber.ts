export function parseFormattedNumber(
  formattedNumber: string | number,
  decimalChar = ',',
) {
  if (formattedNumber === '') return null;

  if (typeof formattedNumber === 'number') return formattedNumber;

  let number = formattedNumber.replace(
    new RegExp(`[^\\d${decimalChar}-]`, 'g'),
    '',
  );

  if (decimalChar !== '.') {
    number = number.replace(decimalChar, '.');
  }

  return Number(number);
}
