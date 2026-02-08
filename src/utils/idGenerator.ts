let counter = 0;
let initialised = false;

/**
 * Derives the next safe counter value from existing charge IDs.
 * Must be called once before the first `generateChargeId()` call.
 */
export function initIdCounter(existingIds: string[]): void {
  let max = 0;
  for (const id of existingIds) {
    const num = Number(id.replace('chg_', ''));
    if (num > max) max = num;
  }
  counter = max;
  initialised = true;
}

export function generateChargeId(): string {
  if (!initialised) {
    throw new Error('initIdCounter() must be called before generating IDs');
  }
  counter += 1;
  return `chg_${String(counter).padStart(3, '0')}`;
}
