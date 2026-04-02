import { useState, useMemo, useCallback } from "react";
import {
  SUPPLIERS,
  SHINGLE_TYPES,
  LABOR_ITEMS,
  MATERIAL_ITEMS,
  DEFAULT_MATERIAL_QTYS,
  DEFAULT_LABOR_QTYS,
  DEFAULT_LABOR_COSTS,
  BASE_LABOR_RATE,
  STEEP_PITCH_TIERS,
  TARP_SYSTEM_CHARGE,
  WASTE_FACTOR_DEFAULT,
  MARKET_CONFIGS,
  calculateShingleSquares,
  calculateLaborSquares,
  calculateMaterialCost,
  calculateSteepPitchAdder,
  calculatePriceForMargin,
  calculateActualMargin,
} from "@/lib/data";
import type { AdditionalCostItem } from "@/lib/data";
import { nanoid } from "nanoid";

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
  market: string; // "stl" | "kc"
  // Waste factor (percentage, e.g. 8 = 8%)
  wasteFactor: number;
  // Steep pitch breakdown (squares at each tier)
  steepPitchSquares: Record<string, number>;
  // Materials
  materialQtys: Record<string, number>;
  // Labor
  laborQtys: Record<string, number>;
  laborCosts: Record<string, number>;
  // Delivery
  deliveryEnabled: boolean;
  deliveryCost: number;
  // Additional costs (free-form line items)
  additionalCosts: AdditionalCostItem[];
  // Margin calculator
  targetMarginPct: number;
  insuranceScopePrice: number; // for scope check comparison
  // Legacy fields (kept for compatibility)
  steepPitchTier: string;
  secondStory: boolean;
  customCosts?: Record<string, number>;
  customCostEnabled?: Record<string, boolean>;
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
  market: MARKET_CONFIGS[0].id,
  wasteFactor: WASTE_FACTOR_DEFAULT,
  steepPitchSquares: { ...defaultSteepPitchSquares },
  materialQtys: { ...DEFAULT_MATERIAL_QTYS },
  laborQtys: { ...DEFAULT_LABOR_QTYS },
  laborCosts: { ...DEFAULT_LABOR_COSTS },
  deliveryEnabled: false,
  deliveryCost: 95,
  additionalCosts: [],
  targetMarginPct: 40,
  insuranceScopePrice: 0,
  steepPitchTier: "none",
  secondStory: false,
};

export function useEstimator() {
  const [state, setState] = useState<EstimatorState>({ ...initialState });

  // Shingle squares (from shingle bundles only, 3 bundles = 1 sq)
  const shingleSquares = useMemo(
    () => calculateShingleSquares(state.materialQtys),
    [state.materialQtys]
  );

  // Labor squares (shingles + starter + ridge + HP ridge bundles / 3)
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

  // Base labor cost (uses market-adjusted rate from laborCosts)
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

  // Labor item count
  const laborItemCount = useMemo(() => {
    let count = laborSquares > 0 ? 1 : 0;
    for (const item of LABOR_ITEMS) {
      if (item.isBaseLabor) continue;
      if ((state.laborQtys[item.id] || 0) > 0) count++;
    }
    if (steepPitchAdder > 0) count++;
    return count;
  }, [laborSquares, state.laborQtys, steepPitchAdder]);

  // Fixed tarp system charge ($50 per job, always)
  const tarpCharge = TARP_SYSTEM_CHARGE;

  // Delivery cost
  const deliveryCostTotal = useMemo(
    () => (state.deliveryEnabled ? state.deliveryCost : 0),
    [state.deliveryEnabled, state.deliveryCost]
  );

  // Additional costs total (free-form items)
  const additionalCostsTotal = useMemo(
    () => state.additionalCosts.reduce((sum, item) => sum + (item.amount || 0), 0),
    [state.additionalCosts]
  );

  // Total custom/other costs
  const totalCustomCosts = useMemo(
    () => tarpCharge + deliveryCostTotal + additionalCostsTotal,
    [tarpCharge, deliveryCostTotal, additionalCostsTotal]
  );

  // Grand total (cost basis)
  const estimateTotal = useMemo(
    () => totalMaterialCost + totalLaborCost + totalCustomCosts,
    [totalMaterialCost, totalLaborCost, totalCustomCosts]
  );

  // ============================================================
  // Margin Calculator (Ryan Part 2)
  // ============================================================
  const requiredCustomerPrice = useMemo(
    () => calculatePriceForMargin(estimateTotal, state.targetMarginPct),
    [estimateTotal, state.targetMarginPct]
  );

  const pricePerSquare = useMemo(
    () => (shingleSquares > 0 ? requiredCustomerPrice / shingleSquares : 0),
    [requiredCustomerPrice, shingleSquares]
  );

  const costPerSquare = useMemo(
    () => (shingleSquares > 0 ? estimateTotal / shingleSquares : 0),
    [estimateTotal, shingleSquares]
  );

  // Insurance scope check: actual margin if they take the insurance price
  const insuranceScopeMargin = useMemo(
    () => calculateActualMargin(estimateTotal, state.insuranceScopePrice),
    [estimateTotal, state.insuranceScopePrice]
  );

  const insuranceScopePerSquare = useMemo(
    () => (shingleSquares > 0 ? state.insuranceScopePrice / shingleSquares : 0),
    [state.insuranceScopePrice, shingleSquares]
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

  // ============================================================
  // Setters
  // ============================================================
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

  const setMarket = useCallback((value: string) => {
    // When market changes, auto-update base labor rate
    const market = MARKET_CONFIGS.find((m) => m.id === value);
    setState((prev) => ({
      ...prev,
      market: value,
      laborCosts: {
        ...prev.laborCosts,
        "base-labor": market ? market.baseLaborRate : BASE_LABOR_RATE,
      },
    }));
  }, []);

  const setWasteFactor = useCallback((value: number) => {
    setState((prev) => ({ ...prev, wasteFactor: Math.max(0, Math.min(20, value)) }));
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

  const setDelivery = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, deliveryEnabled: enabled }));
  }, []);

  const setDeliveryCost = useCallback((cost: number) => {
    setState((prev) => ({ ...prev, deliveryCost: Math.max(0, cost) }));
  }, []);

  const setTargetMarginPct = useCallback((value: number) => {
    setState((prev) => ({ ...prev, targetMarginPct: Math.max(0, Math.min(99, value)) }));
  }, []);

  const setInsuranceScopePrice = useCallback((value: number) => {
    setState((prev) => ({ ...prev, insuranceScopePrice: Math.max(0, value) }));
  }, []);

  // Additional costs (free-form) management
  const addAdditionalCost = useCallback(() => {
    setState((prev) => ({
      ...prev,
      additionalCosts: [
        ...prev.additionalCosts,
        { id: nanoid(8), description: "", amount: 0 },
      ],
    }));
  }, []);

  const updateAdditionalCost = useCallback((id: string, field: "description" | "amount", value: string | number) => {
    setState((prev) => ({
      ...prev,
      additionalCosts: prev.additionalCosts.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeAdditionalCost = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      additionalCosts: prev.additionalCosts.filter((item) => item.id !== id),
    }));
  }, []);

  // Legacy setters
  const setSteepPitchTier = useCallback((value: string) => {
    setState((prev) => ({ ...prev, steepPitchTier: value }));
  }, []);

  const setSecondStory = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, secondStory: value }));
  }, []);

  const setCustomCost = useCallback((_id: string, _amount: number) => {}, []);
  const toggleCustomCost = useCallback((_id: string) => {}, []);

  const resetForm = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const loadState = useCallback((loaded: EstimatorState) => {
    setState({
      ...loaded,
      additionalCosts: loaded.additionalCosts || [],
      wasteFactor: loaded.wasteFactor ?? WASTE_FACTOR_DEFAULT,
      market: loaded.market ?? MARKET_CONFIGS[0].id,
      targetMarginPct: loaded.targetMarginPct ?? 40,
      insuranceScopePrice: loaded.insuranceScopePrice ?? 0,
    });
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
    tarpCharge,
    deliveryCostTotal,
    additionalCostsTotal,
    totalCustomCosts,
    estimateTotal,
    // Margin calculator
    requiredCustomerPrice,
    pricePerSquare,
    costPerSquare,
    insuranceScopeMargin,
    insuranceScopePerSquare,
    // Legacy
    laborQuantities,
    // Setters
    setTrade,
    setJobInfo,
    setSupplier,
    setShingleType,
    setMarket,
    setWasteFactor,
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
    setTargetMarginPct,
    setInsuranceScopePrice,
    addAdditionalCost,
    updateAdditionalCost,
    removeAdditionalCost,
    resetForm,
    loadState,
  };
}
