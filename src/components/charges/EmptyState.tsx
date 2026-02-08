interface EmptyStateProps {
  onAddCharge: () => void;
}

export default function EmptyState({ onAddCharge }: EmptyStateProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue-50">
        <svg
          className="h-8 w-8 text-brand-blue"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3 className="mt-5 text-base font-semibold text-gray-900">
        No charges recorded
      </h3>
      <p className="mt-1.5 text-sm text-gray-500">
        Get started by creating your first charge record.
      </p>
      <button
        onClick={onAddCharge}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-blue-dark shadow-md transition-all hover:bg-brand-yellow-light hover:shadow-lg active:scale-95"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Charge
      </button>
    </div>
  );
}
