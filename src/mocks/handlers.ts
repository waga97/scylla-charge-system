import type { Charge, ChargeCreateInput, ChargeUpdateInput } from '../types';
import { STUB_CHARGES } from './data';
import { generateChargeId } from '../utils/idGenerator';

const STORAGE_KEY = 'supersharkz_charges';
const SIMULATED_DELAY_MS = 300;

function loadCharges(): Charge[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...STUB_CHARGES];
  } catch {
    return [...STUB_CHARGES];
  }
}

function saveCharges(charges: Charge[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), SIMULATED_DELAY_MS),
  );
}

export async function mockGetCharges(): Promise<Charge[]> {
  const charges = loadCharges();
  return delay(charges);
}

export async function mockCreateCharge(
  input: ChargeCreateInput,
): Promise<Charge> {
  const charges = loadCharges();
  const newCharge: Charge = {
    charge_id: generateChargeId(),
    ...input,
  };
  charges.push(newCharge);
  saveCharges(charges);
  return delay(newCharge);
}

export async function mockUpdateCharge(
  chargeId: string,
  input: ChargeUpdateInput,
): Promise<Charge> {
  const charges = loadCharges();
  const index = charges.findIndex((c) => c.charge_id === chargeId);

  if (index === -1) {
    throw new Error(`Charge ${chargeId} not found`);
  }

  const updated: Charge = { ...charges[index], ...input };
  charges[index] = updated;
  saveCharges(charges);
  return delay(updated);
}

export async function mockDeleteCharge(chargeId: string): Promise<void> {
  const charges = loadCharges();
  const filtered = charges.filter((c) => c.charge_id !== chargeId);

  if (filtered.length === charges.length) {
    throw new Error(`Charge ${chargeId} not found`);
  }

  saveCharges(filtered);
  return delay(undefined);
}
