import { useState, useEffect, useCallback } from 'react';
import type { Charge, ChargeCreateInput, ChargeUpdateInput } from '../types';
import { chargeService } from '../services/chargeService';

export function useCharges() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        setIsLoading(true);
        const data = await chargeService.getAll();
        setCharges(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load charges';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharges();
  }, []);

  const addCharge = useCallback(async (input: ChargeCreateInput) => {
    const newCharge = await chargeService.create(input);
    setCharges((prev) => [...prev, newCharge]);
    return newCharge;
  }, []);

  const updateCharge = useCallback(
    async (chargeId: string, input: ChargeUpdateInput) => {
      const updated = await chargeService.update(chargeId, input);
      setCharges((prev) =>
        prev.map((c) => (c.charge_id === chargeId ? updated : c)),
      );
      return updated;
    },
    [],
  );

  const deleteCharge = useCallback(async (chargeId: string) => {
    await chargeService.delete(chargeId);
    setCharges((prev) => prev.filter((c) => c.charge_id !== chargeId));
  }, []);

  return {
    charges,
    isLoading,
    error,
    addCharge,
    updateCharge,
    deleteCharge,
  };
}
