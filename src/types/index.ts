export interface Charge {
  charge_id: string;
  charge_amount: number;
  paid_amount: number;
  student_id: string;
  date_charged: string; // ISO 8601 (YYYY-MM-DD)
}

export type ChargeCreateInput = Omit<Charge, 'charge_id'>;

export type ChargeUpdateInput = Partial<ChargeCreateInput>;

export interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  charge: Charge | null;
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}
