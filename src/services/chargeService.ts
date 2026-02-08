import type { Charge, ChargeCreateInput, ChargeUpdateInput } from '../types';
import {
  mockGetCharges,
  mockCreateCharge,
  mockUpdateCharge,
  mockDeleteCharge,
} from '../mocks/handlers';

export const chargeService = {
  getAll: (): Promise<Charge[]> => {
    return mockGetCharges();
  },

  create: (input: ChargeCreateInput): Promise<Charge> => {
    return mockCreateCharge(input);
  },

  update: (chargeId: string, input: ChargeUpdateInput): Promise<Charge> => {
    return mockUpdateCharge(chargeId, input);
  },

  delete: (chargeId: string): Promise<void> => {
    return mockDeleteCharge(chargeId);
  },
};
