const formatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

// Derived value — computed at render time, never stored
export function getOutstandingAmount(
  chargeAmount: number,
  paidAmount: number,
): number {
  return Math.round((chargeAmount - paidAmount) * 100) / 100;
}
