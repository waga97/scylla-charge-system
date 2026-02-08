import { z } from 'zod';

export const chargeFormSchema = z
  .object({
    student_id: z.string().trim().min(1, 'Student ID is required'),

    charge_amount: z
      .number({ error: 'Charge amount must be a valid number' })
      .positive('Charge amount must be greater than 0')
      .multipleOf(0.01, 'Maximum two decimal places allowed'),

    paid_amount: z
      .number({ error: 'Paid amount must be a valid number' })
      .min(0, 'Paid amount cannot be negative')
      .multipleOf(0.01, 'Maximum two decimal places allowed'),

    date_charged: z
      .string()
      .min(1, 'Date is required')
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return date <= today;
      }, 'Date cannot be in the future'),
  })
  .refine((data) => data.paid_amount <= data.charge_amount, {
    message: 'Paid amount cannot exceed charge amount',
    path: ['paid_amount'],
  });

export type ChargeFormValues = z.infer<typeof chargeFormSchema>;
