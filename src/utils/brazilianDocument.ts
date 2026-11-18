export type BrazilianDocumentType = 'cpf' | 'cnpj';

export function getDocumentDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function identifyBrazilianDocument(value: string): BrazilianDocumentType | null {
  const length = getDocumentDigits(value).length;

  if (length === 11) {
    return 'cpf';
  }

  return length === 14 ? 'cnpj' : null;
}

function calculateCpfDigit(base: string) {
  const sum = [...base].reduce(
    (total, digit, index) => total + Number(digit) * (base.length + 1 - index),
    0,
  );
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function calculateCnpjDigit(base: string) {
  const sum = [...base].reduce((total, digit, index) => {
    const weight = ((base.length - index - 1) % 8) + 2;
    return total + Number(digit) * weight;
  }, 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidBrazilianDocument(value: string) {
  const digits = getDocumentDigits(value);

  if (/^(\d)\1+$/.test(digits)) {
    return false;
  }

  if (digits.length === 11) {
    return (
      Number(digits[9]) === calculateCpfDigit(digits.slice(0, 9)) &&
      Number(digits[10]) === calculateCpfDigit(digits.slice(0, 10))
    );
  }

  if (digits.length === 14) {
    return (
      Number(digits[12]) === calculateCnpjDigit(digits.slice(0, 12)) &&
      Number(digits[13]) === calculateCnpjDigit(digits.slice(0, 13))
    );
  }

  return false;
}

export function formatBrazilianDocument(value: string) {
  const digits = getDocumentDigits(value);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
