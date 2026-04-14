/**
 * Validates a Brazilian CNPJ using the official check-digit algorithm.
 * Accepts both formatted (00.000.000/0001-00) and raw digits.
 */
export function isValidCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) return false;

  // Reject known invalid patterns (all same digit)
  if (/^(\d)\1{13}$/.test(digits)) return false;

  // Validate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const firstCheck = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(digits[12]) !== firstCheck) return false;

  // Validate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const secondCheck = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(digits[13]) !== secondCheck) return false;

  return true;
}

export function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
