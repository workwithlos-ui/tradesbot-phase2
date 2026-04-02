import { useState, useMemo, useCallback } from "react";
import {
  SUPPLIERS,
  SHINGLE_TYPES,
  LABOR_ITEMS,
  MATERIAL_ITEMS,
  CUSTOM_COST_ITEMS,
  DEFAULT_MATERIAL_QTYS,
  DEFAULT_LABOR_QTYS,
  DEFAULT_LABOR_COSTS,
  DEFAULT_CUSTOM_COSTS,
  DEFAULT_CUSTOM_COST_ENABLED,
  BASE_LABOR_RATE,
  STEEP_PITCH_TIERS,
  calculateShingleSquares,
  calculateLaborSquares,
  calculateMaterialCost,
  calculateSteepPitchAdder,
} from "@/lib/data";

export interface EstimatorState {
  // Trade selector
  selectedTrade: string;
  // Customer info
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  // Job info
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  // Steep pitch breakdown (squares at each tier)
  steepPitchSquares: Record<string, number>;
  // Materials
  materialQtys: Record<string, number>;
  // Labor
  laborQtys: Record<string, number>;
  laborCosts: Record<string, number>;
  // Custom/delivery
  customCosts: Record<string, number>;
  customCostEnabled: Record<string, boolean>;
  deliveryEnabled: boolean;
  deliveryCost: number;
  // Legacy fields (kept for compatibility)
  steepPitchTier: string;
  secondStory: boolean;
}

const defaultSteepPitchSquares: Record<string, number> = {};
STEEP_PITCH_TIERS.forEach((t) => {
  defaultSteepPitchSquares[t.id] = 0;
});

const initialState: EstimatorState = {
  selectedTrade: "shingle-roofing",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  jobName: "",
  address: "",
  supplier: SUPPLIERS[0].id,
  shingleType: SHINGLE_TYPES[0].id,
  steepPitchSquares: { ...defaultSteepPitchSquares },
  materialQtys: { ...DEFAULT_MATERIAL_QTYS },
  laborQtys: { ...DEFAULT_LABOR_QTYS },
  laborCosts: { ...DEFAULT_LABOR_COSTS },
  customCosts: { ...DEFAULT_CUSTOM_COSTS },
  customCostEnabled: { ...DEFAULT_CUSTOM_COST_ENABLED },
  deliveryEnabled: false,
  deliveryCost: 95,
  steepPitchTier: "none",
  secondStory: false,
};

export function useEstimator() {
  const [state, setState] = useState<EstimatorState>({ ...initialState });

  // Shingle squares (for display, material ordering)
  const shingleSquares = useMemo(
    () => calculateShingleSquares(state.materialQtys),
    [state.materialQtys]
  );

  // Labor squares (includes starter + ridge cap for labor calc)
  const laborSquares = useMemo(
    () => calculateLaborSquares(state.materialQtys),
    [state.materialQtys]
  );

  // Total material cost
  const totalMaterialCost = useMemo(
    () => calculateMaterialCost(state.materialQtys),
    [state.materialQtys]
  );

  // Steep pitch adder
  const steepPitchAdder = useMemo(
    () => calculateSteepPitchAdder(state.steepPitchSquares),
    [state.steepPitchSquares]
  );

  // Base labor cost
  const baseLaborCost = useMemo(
    () => laborSquares * (state.laborCosts["base-labor"] || BASE_LABOR_RATE),
    [laborSquares, state.laborCosts]
  );

  // Additional labor cost (non-base items)
  const additionalLaborCost = useMemo(() => {
    let total = 0;
    for (const item of LABOR_ITEMS) {
      if (item.isBaseLabor) continue;
      const qty = state.laborQtys[item.id] || 0;
      const cost = state.laborCosts[item.id] || item.defaultCostPerUnit;
      total += qty * cost;
    }
    return total;
  }, [state.laborQtys, state.laborCosts]);

  // Total labor cost
  const totalLaborCost = useMemo(
    () => baseLaborCost + steepPitchAdder + additionalLaborCost,
    [baseLaborCost, steepPitchAdder, additionalLaborCost]
  );

  // Material item count (items with qty > 0)
  const materialItemCount = useMemo(
    () => Object.values(state.materialQtys).filter((v) => v > 0).length,
    [state.materialQtys]
  );

  // Labor item count (non-base items with qty > 0)
  const laborItemCount = useMemo(
    () => {
      let count = laborSquares > 0 ? 1 : 0; // base labor
      for (const item of LABOR_ITEMS) {
        if (item.isBaseLabor) continue;
        if ((state.laborQtys[item.id] || 0) > 0) count++;
      }
      if (steepPitchAdder > 0) count++;
      return count;
    },
    [laborSquares, state.laborQtys, steepPitchAdder]
  );

  // Custom costs total
  const totalCustomCosts = useMemo(() => {
    let total = 0;
    CUSTOM_COST_ITEMS.forEach((item) => {
      if (state.customCostEnabled[item.id]) {
        total += state.customCosts[item.id] || 0;
      }
    });
    if (state.deliveryEnabled) {
      total += state.deliveryCost;
    }
    return total;
  }, [state.customCosts, state.customCostEnabled, state.deliveryEnabled, state.deliveryCost]);

  // Grand total
  const estimateTotal = useMemo(
    () => totalMaterialCost + totalLaborCost + totalCustomCosts,
    [totalMaterialCost, totalLaborCost, totalCustomCosts]
  );

  // Legacy compatibility
  const totalSquares = shingleSquares;
  const laborQuantities = useMemo(() => {
    const result: Record<string, number> = {};
    LABOR_ITEMS.forEach((item) => {
      result[item.id] = item.isBaseLabor ? laborSquares : (state.laborQtys[item.id] || 0);
    });
    return result;
  }, [laborSquares, state.laborQtys]);

  // Setters
  const setTrade = useCallback((value: string) => {
    setState((prev) => ({ ...prev, selectedTrade: value }));
  }, []);

  const setJobInfo = useCallback((field: string, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setSupplier = useCallback((value: string) => {
    setState((prev) => ({ ...prev, supplier: value }));
  }, []);

  const setShingleType = useCallback((value: string) => {
    setState((prev) => ({ ...prev, shingleType: value }));
  }, []);

  const setSteepPitchSquares = useCallback((tierId: string, squares: number) => {
    setState((prev) => ({
      ...prev,
      steepPitchSquares: { ...prev.steepPitchSquares, [tierId]: Math.max(0, squares) },
    }));
  }, []);

  const setMaterialQty = useCallback((id: string, qty: number) => {
    setState((prev) => ({
      ...prev,
      materialQtys: { ...prev.materialQtys, [id]: Math.max(0, qty) },
    }));
  }, []);

  const setLaborQty = useCallback((id: string, qty: number) => {
    setState((prev) => ({
      ...prev,
      laborQtys: { ...prev.laborQtys, [id]: Math.max(0, qty) },
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

  // Legacy setters
  const setSteepPitchTier = useCallback((value: string) => {
    setState((prev) => ({ ...prev, steepPitchTier: value }));
  }, []);

  const setSecondStory = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, secondStory: value }));
  }, []);

  const resetForm = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const loadState = useCallback((loaded: EstimatorState) => {
    setState(loaded);
  }, []);

  return {
    state,
    shingleSquares,
    laborSquares,
    totalSquares: shingleSquares,
    totalMaterialCost,
    baseLaborCost,
    additionalLaborCost,
    steepPitchAdder,
    totalLaborCost,
    materialItemCount,
    laborItemCount,
    totalCustomCosts,
    estimateTotal,
    laborQuantities,
    setTrade,
    setJobInfo,
    setSupplier,
    setShingleType,
    setSteepPitchSquares,
    setSteepPitchTier,
    setSecondStory,
    setMaterialQty,
    setLaborQty,
    setLaborCost,
    setCustomCost,
    toggleCustomCost,
    setDelivery,
    setDeliveryCost,
    resetForm,
    loadState,
  };
}
