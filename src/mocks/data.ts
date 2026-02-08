import type { Charge } from '../types';

export const STUB_CHARGES: Charge[] = [
  {
    charge_id: 'chg_001',
    charge_amount: 120.0,
    paid_amount: 0.0,
    student_id: 'stu_101',
    date_charged: '2025-01-05',
  },
  {
    charge_id: 'chg_002',
    charge_amount: 80.5,
    paid_amount: 80.5,
    student_id: 'stu_102',
    date_charged: '2025-01-07',
  },
  {
    charge_id: 'chg_003',
    charge_amount: 150.0,
    paid_amount: 50.0,
    student_id: 'stu_101',
    date_charged: '2025-01-12',
  },
  {
    charge_id: 'chg_004',
    charge_amount: 95.0,
    paid_amount: 0.0,
    student_id: 'stu_103',
    date_charged: '2025-01-15',
  },
  {
    charge_id: 'chg_005',
    charge_amount: 200.0,
    paid_amount: 200.0,
    student_id: 'stu_104',
    date_charged: '2025-01-20',
  },
];
