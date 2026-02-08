import { useState, useCallback } from 'react';
import { useCharges } from './hooks/useCharges';
import type {
  Charge,
  ChargeCreateInput,
  ModalState,
  Notification,
} from './types';
import ChargeTable from './components/charges/ChargeTable';
import ChargeForm from './components/charges/ChargeForm';
import DeleteConfirmDialog from './components/charges/DeleteConfirmDialog';
import EmptyState from './components/charges/EmptyState';
import Modal from './components/ui/Modal';

function App() {
  const { charges, isLoading, error, addCharge, updateCharge, deleteCharge } =
    useCharges();

  const [modal, setModal] = useState<ModalState>({ type: null, charge: null });
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const openAddModal = () => setModal({ type: 'add', charge: null });
  const openEditModal = (charge: Charge) => setModal({ type: 'edit', charge });
  const openDeleteModal = (charge: Charge) =>
    setModal({ type: 'delete', charge });
  const closeModal = () => setModal({ type: null, charge: null });

  const handleAdd = async (data: ChargeCreateInput): Promise<void> => {
    try {
      const created = await addCharge(data);
      closeModal();
      notify(`Charge ${created.charge_id} added successfully`, 'success');
    } catch {
      notify('Failed to add charge', 'error');
    }
  };

  const handleEdit = async (data: ChargeCreateInput): Promise<void> => {
    if (!modal.charge) return;
    try {
      await updateCharge(modal.charge.charge_id, data);
      closeModal();
      notify(
        `Charge ${modal.charge.charge_id} updated successfully`,
        'success',
      );
    } catch {
      notify('Failed to update charge', 'error');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!modal.charge) return;
    try {
      await deleteCharge(modal.charge.charge_id);
      closeModal();
      notify(`Charge ${modal.charge.charge_id} deleted`, 'success');
    } catch {
      notify('Failed to delete charge', 'error');
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-blue shadow-lg">
        <div className="h-1 bg-brand-yellow" />
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Charge Management
              </h1>
              <p className="mt-1 text-sm text-blue-200">
                Supersharkz Swim School
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-blue-dark shadow-md transition-all hover:bg-brand-yellow-light hover:shadow-lg active:scale-95"
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
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${
              notification.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            <svg
              className={`h-5 w-5 shrink-0 ${
                notification.type === 'success'
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {notification.type === 'success' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              )}
            </svg>
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-blue" />
          </div>
        ) : charges.length === 0 ? (
          <EmptyState onAddCharge={openAddModal} />
        ) : (
          <ChargeTable
            charges={charges}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </main>

      {/* Add Charge Modal */}
      {modal.type === 'add' && (
        <Modal isOpen={true} onClose={closeModal} title="Add New Charge">
          <ChargeForm onSubmit={handleAdd} onCancel={closeModal} />
        </Modal>
      )}

      {/* Edit Charge Modal */}
      {modal.type === 'edit' && modal.charge && (
        <Modal isOpen={true} onClose={closeModal} title="Edit Charge">
          <ChargeForm
            initialValues={modal.charge}
            onSubmit={handleEdit}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {modal.type === 'delete' && modal.charge && (
        <DeleteConfirmDialog
          charge={modal.charge}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

export default App;
