import type { Charge } from '../../types';
import { formatCurrency, getOutstandingAmount } from '../../utils/currency';

interface ChargeRowProps {
  charge: Charge;
  isEven: boolean;
  onEdit: (charge: Charge) => void;
  onDelete: (charge: Charge) => void;
}

export default function ChargeRow({
  charge,
  isEven,
  onEdit,
  onDelete,
}: ChargeRowProps) {
  const outstanding = getOutstandingAmount(
    charge.charge_amount,
    charge.paid_amount,
  );
  const isPaid = outstanding === 0;

  return (
    <tr
      className={`transition-colors hover:bg-brand-blue-50 ${
        isEven ? 'bg-white' : 'bg-gray-50/50'
      }`}
    >
      <td className="px-5 py-3.5 text-sm font-mono text-gray-600">
        {charge.charge_id}
      </td>
      <td className="px-5 py-3.5 text-sm font-mono text-gray-600">
        {charge.student_id}
      </td>
      <td className="px-5 py-3.5 text-sm text-right font-medium text-gray-900">
        {formatCurrency(charge.charge_amount)}
      </td>
      <td className="px-5 py-3.5 text-sm text-right text-gray-700">
        {formatCurrency(charge.paid_amount)}
      </td>
      <td className="px-5 py-3.5 text-sm text-center text-gray-600">
        {charge.date_charged}
      </td>
      <td className="px-5 py-3.5 text-right">
        {isPaid ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {formatCurrency(0)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {formatCurrency(outstanding)}
          </span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onEdit(charge)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-blue transition-colors hover:bg-brand-blue-50"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(charge)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
