let counter = 5; // Start after the 5 stub records

export function generateChargeId(): string {
  counter += 1;
  return `chg_${String(counter).padStart(3, '0')}`;
}

export function resetIdCounter(startFrom = 5): void {
  counter = startFrom;
}
