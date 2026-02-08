import { useState } from 'react';
import type { Charge, ChargeCreateInput } from '../../types';
import { chargeFormSchema } from '../../schemas/charge';

interface ChargeFormProps {
  initialValues?: Charge;
  onSubmit: (data: ChargeCreateInput) => Promise<void>;
  onCancel: () => void;
}

interface FormFields {
  student_id: string;
  charge_amount: string;
  paid_amount: string;
  date_charged: string;
}

interface FieldErrors {
  student_id?: string;
  charge_amount?: string;
  paid_amount?: string;
  date_charged?: string;
}

function getInitialFields(charge?: Charge): FormFields {
  if (!charge) {
    return {
      student_id: '',
      charge_amount: '',
      paid_amount: '0',
      date_charged: '',
    };
  }
  return {
    student_id: charge.student_id,
    charge_amount: String(charge.charge_amount),
    paid_amount: String(charge.paid_amount),
    date_charged: charge.date_charged,
  };
}

export default function ChargeForm({
  initialValues,
  onSubmit,
  onCancel,
}: ChargeFormProps) {
  const isEditMode = !!initialValues;
  const [fields, setFields] = useState<FormFields>(
    getInitialFields(initialValues),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: keyof FormFields, value: string) => {
    const updated = { ...fields, [name]: value };
    setFields(updated);

    if (hasSubmitted) {
      validateFields(updated);
    }
  };

  const validateFields = (current: FormFields): FieldErrors => {
    const parsed = chargeFormSchema.safeParse({
      student_id: current.student_id,
      charge_amount:
        current.charge_amount === ''
          ? undefined
          : Number(current.charge_amount),
      paid_amount:
        current.paid_amount === '' ? undefined : Number(current.paid_amount),
      date_charged: current.date_charged,
    });

    if (parsed.success) {
      setErrors({});
      return {};
    }

    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0] as keyof FieldErrors;
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return fieldErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const fieldErrors = validateFields(fields);
    if (Object.keys(fieldErrors).length > 0) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        student_id: fields.student_id.trim(),
        charge_amount: Math.round(Number(fields.charge_amount) * 100) / 100,
        paid_amount: Math.round(Number(fields.paid_amount) * 100) / 100,
        date_charged: fields.date_charged,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <FormField
          label="Student ID"
          name="student_id"
          type="text"
          placeholder="e.g. stu_101"
          value={fields.student_id}
          error={errors.student_id}
          onChange={(val) => updateField('student_id', val)}
        />

        <FormField
          label="Charge Amount (RM)"
          name="charge_amount"
          type="number"
          placeholder="e.g. 120.00"
          value={fields.charge_amount}
          error={errors.charge_amount}
          onChange={(val) => updateField('charge_amount', val)}
          min="0.01"
          step="0.01"
        />

        <FormField
          label="Paid Amount (RM)"
          name="paid_amount"
          type="number"
          placeholder="e.g. 0.00"
          value={fields.paid_amount}
          error={errors.paid_amount}
          onChange={(val) => updateField('paid_amount', val)}
          min="0"
          step="0.01"
        />

        <FormField
          label="Date Charged"
          name="date_charged"
          type="date"
          value={fields.date_charged}
          error={errors.date_charged}
          onChange={(val) => updateField('date_charged', val)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue-dark hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? 'Saving…'
            : isEditMode
              ? 'Update Charge'
              : 'Add Charge'}
        </button>
      </div>
    </form>
  );
}

// Reusable form field component — DRY for the 4 fields
interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
}

function FormField({
  label,
  name,
  type,
  value,
  error,
  placeholder,
  onChange,
  min,
  max,
  step,
}: FormFieldProps) {
  const hasError = !!error;

  return (
    <div>
      <label
        htmlFor={name}
        className={`block text-sm font-medium ${
          hasError ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-brand-blue focus:ring-blue-200'
        }`}
      />
      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
