import { useState, useMemo } from 'react';
import type { Charge, SortConfig, SortField } from '../../types';
import { formatCurrency, getOutstandingAmount } from '../../utils/currency';
import ChargeRow from './ChargeRow';

interface ChargeTableProps {
  charges: Charge[];
  onEdit: (charge: Charge) => void;
  onDelete: (charge: Charge) => void;
}

const COLUMNS: {
  label: string;
  field: SortField | null;
  align: string;
}[] = [
  { label: 'Charge ID', field: 'charge_id', align: 'text-left' },
  { label: 'Student ID', field: 'student_id', align: 'text-left' },
  { label: 'Charge Amount', field: 'charge_amount', align: 'text-right' },
  { label: 'Paid Amount', field: 'paid_amount', align: 'text-right' },
  { label: 'Date Charged', field: 'date_charged', align: 'text-center' },
  { label: 'Outstanding', field: 'outstanding', align: 'text-right' },
  { label: 'Actions', field: null, align: 'text-right' },
];

function getSortValue(charge: Charge, field: SortField): string | number {
  if (field === 'outstanding') {
    return getOutstandingAmount(charge.charge_amount, charge.paid_amount);
  }
  return charge[field];
}

function sortCharges(charges: Charge[], config: SortConfig | null): Charge[] {
  if (!config) return charges;
  const { field, direction } = config;
  const sorted = [...charges].sort((a, b) => {
    const aVal = getSortValue(a, field);
    const bVal = getSortValue(b, field);
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
}

function filterCharges(charges: Charge[], query: string): Charge[] {
  if (!query) return charges;
  const q = query.toLowerCase();
  return charges.filter(
    (c) =>
      c.charge_id.toLowerCase().includes(q) ||
      c.student_id.toLowerCase().includes(q) ||
      c.date_charged.includes(q) ||
      String(c.charge_amount).includes(q) ||
      String(c.paid_amount).includes(q),
  );
}

function useSummaryStats(charges: Charge[]) {
  const totalCharged = charges.reduce((sum, c) => sum + c.charge_amount, 0);
  const totalPaid = charges.reduce((sum, c) => sum + c.paid_amount, 0);
  const totalOutstanding = charges.reduce(
    (sum, c) => sum + getOutstandingAmount(c.charge_amount, c.paid_amount),
    0,
  );
  return { totalCharged, totalPaid, totalOutstanding };
}

export default function ChargeTable({
  charges,
  onEdit,
  onDelete,
}: ChargeTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filtered = useMemo(
    () => filterCharges(charges, searchQuery),
    [charges, searchQuery],
  );
  const sorted = useMemo(
    () => sortCharges(filtered, sortConfig),
    [filtered, sortConfig],
  );

  const { totalCharged, totalPaid, totalOutstanding } =
    useSummaryStats(charges);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        return prev.direction === 'asc' ? { field, direction: 'desc' } : null;
      }
      return { field, direction: 'asc' };
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Charged"
          value={formatCurrency(totalCharged)}
          color="blue"
        />
        <SummaryCard
          label="Total Paid"
          value={formatCurrency(totalPaid)}
          color="green"
        />
        <SummaryCard
          label="Total Outstanding"
          value={formatCurrency(totalOutstanding)}
          color="red"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by student ID, charge ID, amount, or date…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-brand-blue">
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white ${col.align} ${
                    col.field
                      ? 'cursor-pointer select-none transition-colors hover:bg-brand-blue-light'
                      : ''
                  }`}
                  onClick={col.field ? () => handleSort(col.field!) : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.field && (
                      <SortIndicator
                        active={sortConfig?.field === col.field}
                        direction={
                          sortConfig?.field === col.field
                            ? sortConfig.direction
                            : null
                        }
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-5 py-10 text-center text-sm text-gray-400"
                >
                  No charges match your search.
                </td>
              </tr>
            ) : (
              sorted.map((charge, index) => (
                <ChargeRow
                  key={charge.charge_id}
                  charge={charge}
                  isEven={index % 2 === 0}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-right text-xs text-gray-400">
        {searchQuery
          ? `${sorted.length} of ${charges.length} charge${charges.length !== 1 ? 's' : ''}`
          : `Showing ${charges.length} charge${charges.length !== 1 ? 's' : ''}`}
      </p>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────── */

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc' | null;
}) {
  if (!active || !direction) {
    return (
      <svg
        className="h-3.5 w-3.5 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-3.5 w-3.5 text-brand-yellow"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={
          direction === 'asc'
            ? 'M4.5 15.75l7.5-7.5 7.5 7.5'
            : 'M19.5 8.25l-7.5 7.5-7.5-7.5'
        }
      />
    </svg>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  color: 'blue' | 'green' | 'red';
}

const CARD_STYLES = {
  blue: 'border-l-brand-blue bg-brand-blue-50',
  green: 'border-l-green-500 bg-green-50',
  red: 'border-l-red-500 bg-red-50',
} as const;

const VALUE_STYLES = {
  blue: 'text-brand-blue',
  green: 'text-green-700',
  red: 'text-red-700',
} as const;

function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <div
      className={`rounded-lg border-l-4 px-5 py-4 shadow-sm ${CARD_STYLES[color]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold ${VALUE_STYLES[color]}`}>{value}</p>
    </div>
  );
}
