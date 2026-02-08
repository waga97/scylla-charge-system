import { useState } from 'react';
import type { Charge } from '../../types';
import { formatCurrency } from '../../utils/currency';
import Modal from '../ui/Modal';

const CONFIRM_WORD = 'DELETE';

interface DeleteConfirmDialogProps {
  charge: Charge;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  charge,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const isConfirmed = confirmText === CONFIRM_WORD;

  const handleConfirm = async () => {
    if (isSubmitting || !isConfirmed) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Delete Charge">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Are you sure you want to delete charge{' '}
          <strong className="text-gray-900">{charge.charge_id}</strong> for
          student <strong className="text-gray-900">{charge.student_id}</strong>
          ?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently remove the{' '}
          <strong>{formatCurrency(charge.charge_amount)}</strong> charge dated{' '}
          {charge.date_charged}. This action cannot be undone.
        </p>

        {/* Type-to-confirm */}
        <div className="mt-5 text-left">
          <label
            htmlFor="confirm-delete"
            className="block text-sm text-gray-600"
          >
            Type{' '}
            <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs font-bold text-red-700">
              {CONFIRM_WORD}
            </span>{' '}
            to confirm
          </label>
          <input
            id="confirm-delete"
            type="text"
            autoFocus
            autoComplete="off"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder={CONFIRM_WORD}
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-center font-mono text-sm tracking-widest text-gray-700 transition-colors placeholder:text-gray-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isConfirmed || isSubmitting}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? 'Deleting…' : 'Delete Charge'}
        </button>
      </div>
    </Modal>
  );
}
