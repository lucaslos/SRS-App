import { addThousandsSeparator } from '@utils/addThousandsSeparator';
import { isNumber } from '@utils/isNumber';

const currencyConfig = {
  BRL: {
    decimalSymbol: ',',
    thousandsSymbol: '.',
    prefix: 'R$ ',
  },
};

function getDigitsFromValue(value: string) {
  return value.replace(/(-(?!\d))|[^0-9|-]/g, '') || '';
}

function padDigits(digits: string) {
  const desiredLength = 3;
  const actualLength = digits.length;

  if (actualLength >= desiredLength) {
    return digits;
  }

  const amountToAdd = desiredLength - actualLength;
  const padding = '0'.repeat(amountToAdd);

  return padding + digits;
}

function removeLeadingZeros(number: string) {
  return number.replace(/^0+([0-9]+)/, '$1');
}

function addDecimalToNumber(number: string, separator: string) {
  const centsStartingPosition = number.length - 2;
  const dollars = removeLeadingZeros(
    number.substring(0, centsStartingPosition),
  );
  const cents = number.substring(centsStartingPosition);
  return dollars + separator + cents;
}

export const currencyMask = (
  value: string,
  {
    currency = 'BRL',
    numberValue,
  }: {
    currency?: keyof typeof currencyConfig;
    numberValue?: boolean;
  } = {},
) => {
  const { decimalSymbol, thousandsSymbol, prefix } = currencyConfig[currency];

  const addPrefix = (str: string) => `${prefix}${str}`;

  let normalizedValue = value;

  if (numberValue && isNumber(normalizedValue)) {
    const decimals = value.split('.')[1] || '';
    normalizedValue =
      decimals.length !== 2
        ? Number(normalizedValue).toFixed(2)
        : normalizedValue;
  }

  const digits = getDigitsFromValue(normalizedValue);

  if (digits.trim() === '') return '';

  if (digits === '00') {
    return addPrefix('0');
  }

  const digitsWithPadding = padDigits(digits);
  const formattedValue = addDecimalToNumber(digitsWithPadding, decimalSymbol);

  const [integer, decimals] = formattedValue.split(decimalSymbol);

  return addPrefix(
    `${addThousandsSeparator(
      integer,
      thousandsSymbol,
    )}${decimalSymbol}${decimals}`,
  );
};
