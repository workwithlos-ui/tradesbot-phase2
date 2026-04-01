import { useState, useMemo, useCallback } from "react";
import {
  SUPPLIERS,
  SHINGLE_TYPES,
  CUSTOM_COST_ITEMS,
  LABOR_ITEMS,
  DEFAULT_MATERIAL_QTYS,
  DEFAULT_LABOR_COSTS,
  DEFAULT_CUSTOM_COSTS,
  DEFAULT_CUSTOM_COST_ENABLED,
  calculateTotalSquares,
  calculateLaborQuantities,
} from "@/lib/data";

export interface EstimatorState {
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  steepPitchTier: string;
  secondStory: boolean;
  materialQtys: Record<string, number>;
  laborCosts: Record<string, number>;
  customCosts: Record<string, number>;
  customCostEnabled: Record<string, boolean>;
  deliveryEnabled: boolean;
  deliveryCost: number;
  // Customer info fields
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

const initialState: EstimatorState = {
  jobName: "",
  address: "",
  supplier: SUPPLIERS[0].id,
  shingleType: SHINGLE_TYPES[0].id,
  steepPitchTier: "none",
  secondStory: false,
  materialQtys: { ...DEFAULT_MATERIAL_QTYS },
  laborCosts: { ...DEFAULT_LABOR_COSTS },
  customCosts: { ...DEFAULT_CUSTOM_COSTS },
  customCostEnabled: { ...DEFAULT_CUSTOM_COST_ENABLED },
  deliveryEnabled: false,
  deliveryCost: 95,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
};

export function useEstimator() {
  const [state, setState] = useState<EstimatorState>({ ...initialState });

  const totalSquares = useMemo(
    () => calculateTotalSquares(state.materialQtys),
    [state.materialQtys]
  );

  const laborQuantities = useMemo(
    () =>
      calculateLaborQuantities(
        totalSquares,
        state.materialQtys,
        state.steepPitchTier,
        state.secondStory
      ),
    [totalSquares, state.materialQtys, state.steepPitchTier, state.secondStory]
  );

  const materialItemCount = useMemo(
    () => Object.values(state.materialQtys).filter((v) => v > 0).length,
    [state.materialQtys]
  );

  const laborItemCount = useMemo(
    () => Object.values(laborQuantities).filter((v) => v > 0).length,
    [laborQuantities]
  );

  const totalCustomCosts = useMemo(
    () =>
      CUSTOM_COST_ITEMS.reduce(
        (sum, item) =>
          state.customCostEnabled[item.id]
            ? sum + (state.customCosts[item.id] || 0)
            : sum,
        0
      ),
    [state.customCosts, state.customCostEnabled]
  );

  const totalLaborCost = useMemo(
    () =>
      LABOR_ITEMS.reduce((sum, item) => {
        const qty = laborQuantities[item.id] || 0;
        const cost = state.laborCosts[item.id] || 0;
        return sum + qty * cost;
      }, 0),
    [laborQuantities, state.laborCosts]
  );

  const setJobInfo = useCallback((field: string, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setSupplier = useCallback((value: string) => {
    setState((prev) => ({ ...prev, supplier: value }));
  }, []);

  const setShingleType = useCallback((value: string) => {
    setState((prev) => ({ ...prev, shingleType: value }));
  }, []);

  const setSteepPitchTier = useCallback((value: string) => {
    setState((prev) => ({ ...prev, steepPitchTier: value }));
  }, []);

  const setSecondStory = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, secondStory: value }));
  }, []);

  const setMaterialQty = useCallback((id: string, qty: number) => {
    setState((prev) => ({
      ...prev,
      materialQtys: { ...prev.materialQtys, [id]: Math.max(0, qty) },
    }));
  }, []);

  const setLaborCost = useCallback((id: string, cost: number) => {
    setState((prev) => ({
      ...prev,
      laborCosts: { ...prev.laborCosts, [id]: Math.max(0, cost) },
    }));
  }, []);

  const setCustomCost = useCallback((id: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      customCosts: { ...prev.customCosts, [id]: Math.max(0, amount) },
    }));
  }, []);

  const toggleCustomCost = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      customCostEnabled: {
        ...prev.customCostEnabled,
        [id]: !prev.customCostEnabled[id],
      },
    }));
  }, []);

  const setDelivery = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, deliveryEnabled: enabled }));
  }, []);

  const setDeliveryCost = useCallback((cost: number) => {
    setState((prev) => ({ ...prev, deliveryCost: Math.max(0, cost) }));
  }, []);

  const resetForm = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const loadState = useCallback((loaded: EstimatorState) => {
    setState(loaded);
  }, []);

  return {
    state,
    totalSquares,
    laborQuantities,
    materialItemCount,
    laborItemCount,
    totalCustomCosts,
    totalLaborCost,
    setJobInfo,
    setSupplier,
    setShingleType,
    setSteepPitchTier,
    setSecondStory,
    setMaterialQty,
    setLaborCost,
    setCustomCost,
    toggleCustomCost,
    setDelivery,
    setDeliveryCost,
    resetForm,
    loadState,
  };
}
