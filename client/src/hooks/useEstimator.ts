import { useState, useMemo, useCallback } from "react";
import {
  SUPPLIERS,
  SHINGLE_TYPES,
  MARKET_CONFIGS,
  VENT_OPTIONS,
  TARP_SYSTEM_CHARGE,
  WASTE_FACTOR_DEFAULT,
  BASE_LABOR_RATE,
  getDefaultMeasurements,
  getTotalSquares,
  calculateMaterials,
  calculateMaterialCostLines,
  calculateLaborCostLines,
  calculatePriceForMargin,
  calculateActualMargin,
} from "@/lib/data";
import type { RoofMeasurements, AdditionalCostItem, MaterialCostLine, LaborCostLine } from "@/lib/data";
import { nanoid } from "nanoid";

export interface EstimatorState {
  selectedTrade: string;
  // Customer
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  // Job
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  market: string;
  // Waste
  wasteFactor: number;
  // Roof measurements (the new input model)
  measurements: RoofMeasurements;
  // Labor rate overrides (user can tweak individual rates)
  laborOverrides: Record<string, number>;
  // Delivery
  deliveryEnabled: boolean;
  deliveryCost: number;
  // Additional costs (free-form)
  additionalCosts: AdditionalCostItem[];
  // Margin
  targetMarginPct: number;
  insuranceScopePrice: number;
}

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
  measurements: getDefaultMeasurements(),
  laborOverrides: {},
  deliveryEnabled: false,
  deliveryCost: 95,
  additionalCosts: [],
  targetMarginPct: 40,
  insuranceScopePrice: 0,
};

export function useEstimator() {
  const [state, setState] = useState<EstimatorState>({ ...initialState, measurements: getDefaultMeasurements() });

  // Resolve shingle type object
  const shingleTypeObj = useMemo(
    () => SHINGLE_TYPES.find(s => s.id === state.shingleType) || SHINGLE_TYPES[0],
    [state.shingleType]
  );

  // Resolve market
  const marketObj = useMemo(
    () => MARKET_CONFIGS.find(m => m.id === state.market) || MARKET_CONFIGS[0],
    [state.market]
  );

  const baseLaborRate = marketObj.baseLaborRate;

  // Auto-calculate materials from measurements
  const calculatedMaterials = useMemo(
    () => calculateMaterials(state.measurements, shingleTypeObj, state.wasteFactor),
    [state.measurements, shingleTypeObj, state.wasteFactor]
  );

  // Material cost lines
  const materialCostLines = useMemo(
    () => calculateMaterialCostLines(calculatedMaterials, shingleTypeObj, state.measurements),
    [calculatedMaterials, shingleTypeObj, state.measurements]
  );

  // Total material cost
  const totalMaterialCost = useMemo(
    () => materialCostLines.reduce((sum, line) => sum + line.total, 0),
    [materialCostLines]
  );

  // Labor cost lines
  const laborCostLines = useMemo(
    () => calculateLaborCostLines(state.measurements, calculatedMaterials, baseLaborRate, state.laborOverrides),
    [state.measurements, calculatedMaterials, baseLaborRate, state.laborOverrides]
  );

  // Total labor cost
  const totalLaborCost = useMemo(
    () => laborCostLines.reduce((sum, line) => sum + line.total, 0),
    [laborCostLines]
  );

  // Fixed charges
  const tarpCharge = TARP_SYSTEM_CHARGE;
  const deliveryCostTotal = useMemo(
    () => state.deliveryEnabled ? state.deliveryCost : 0,
    [state.deliveryEnabled, state.deliveryCost]
  );
  const additionalCostsTotal = useMemo(
    () => state.additionalCosts.reduce((sum, item) => sum + (item.amount || 0), 0),
    [state.additionalCosts]
  );
  const totalCustomCosts = useMemo(
    () => tarpCharge + deliveryCostTotal + additionalCostsTotal,
    [tarpCharge, deliveryCostTotal, additionalCostsTotal]
  );

  // Grand total
  const estimateTotal = useMemo(
    () => totalMaterialCost + totalLaborCost + totalCustomCosts,
    [totalMaterialCost, totalLaborCost, totalCustomCosts]
  );

  // Margin calculator
  const requiredCustomerPrice = useMemo(
    () => calculatePriceForMargin(estimateTotal, state.targetMarginPct),
    [estimateTotal, state.targetMarginPct]
  );

  const totalSquares = useMemo(() => getTotalSquares(state.measurements), [state.measurements]);

  const pricePerSquare = useMemo(
    () => totalSquares > 0 ? requiredCustomerPrice / totalSquares : 0,
    [requiredCustomerPrice, totalSquares]
  );

  const costPerSquare = useMemo(
    () => totalSquares > 0 ? estimateTotal / totalSquares : 0,
    [estimateTotal, totalSquares]
  );

  const insuranceScopeMargin = useMemo(
    () => calculateActualMargin(estimateTotal, state.insuranceScopePrice),
    [estimateTotal, state.insuranceScopePrice]
  );

  const insuranceScopePerSquare = useMemo(
    () => totalSquares > 0 ? state.insuranceScopePrice / totalSquares : 0,
    [state.insuranceScopePrice, totalSquares]
  );

  // Counts
  const materialItemCount = materialCostLines.length;
  const laborItemCount = laborCostLines.length;

  // ---- Setters ----

  const setTrade = useCallback((value: string) => {
    setState(prev => ({ ...prev, selectedTrade: value }));
  }, []);

  const setJobInfo = useCallback((field: string, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setSupplier = useCallback((value: string) => {
    setState(prev => ({ ...prev, supplier: value }));
  }, []);

  const setShingleType = useCallback((value: string) => {
    setState(prev => ({ ...prev, shingleType: value }));
  }, []);

  const setMarket = useCallback((value: string) => {
    setState(prev => ({ ...prev, market: value }));
  }, []);

  const setWasteFactor = useCallback((value: number) => {
    setState(prev => ({ ...prev, wasteFactor: Math.max(4, Math.min(15, value)) }));
  }, []);

  const setMeasurement = useCallback((field: keyof RoofMeasurements, value: number | string | boolean) => {
    setState(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: value },
    }));
  }, []);

  const setLaborOverride = useCallback((id: string, rate: number) => {
    setState(prev => ({
      ...prev,
      laborOverrides: { ...prev.laborOverrides, [id]: Math.max(0, rate) },
    }));
  }, []);

  const setDelivery = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, deliveryEnabled: enabled }));
  }, []);

  const setDeliveryCost = useCallback((cost: number) => {
    setState(prev => ({ ...prev, deliveryCost: Math.max(0, cost) }));
  }, []);

  const setTargetMarginPct = useCallback((value: number) => {
    setState(prev => ({ ...prev, targetMarginPct: Math.max(0, Math.min(99, value)) }));
  }, []);

  const setInsuranceScopePrice = useCallback((value: number) => {
    setState(prev => ({ ...prev, insuranceScopePrice: Math.max(0, value) }));
  }, []);

  const addAdditionalCost = useCallback(() => {
    setState(prev => ({
      ...prev,
      additionalCosts: [...prev.additionalCosts, { id: nanoid(8), description: "", amount: 0 }],
    }));
  }, []);

  const updateAdditionalCost = useCallback((id: string, field: "description" | "amount", value: string | number) => {
    setState(prev => ({
      ...prev,
      additionalCosts: prev.additionalCosts.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeAdditionalCost = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      additionalCosts: prev.additionalCosts.filter(item => item.id !== id),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setState({ ...initialState, measurements: getDefaultMeasurements() });
  }, []);

  const loadState = useCallback((loaded: EstimatorState) => {
    setState({
      ...loaded,
      measurements: loaded.measurements || getDefaultMeasurements(),
      additionalCosts: loaded.additionalCosts || [],
      laborOverrides: loaded.laborOverrides || {},
      wasteFactor: loaded.wasteFactor ?? WASTE_FACTOR_DEFAULT,
      market: loaded.market ?? MARKET_CONFIGS[0].id,
      targetMarginPct: loaded.targetMarginPct ?? 40,
      insuranceScopePrice: loaded.insuranceScopePrice ?? 0,
    });
  }, []);

  return {
    state,
    shingleTypeObj,
    marketObj,
    baseLaborRate,
    calculatedMaterials,
    materialCostLines,
    laborCostLines,
    totalSquares,
    totalMaterialCost,
    totalLaborCost,
    materialItemCount,
    laborItemCount,
    tarpCharge,
    deliveryCostTotal,
    additionalCostsTotal,
    totalCustomCosts,
    estimateTotal,
    requiredCustomerPrice,
    pricePerSquare,
    costPerSquare,
    insuranceScopeMargin,
    insuranceScopePerSquare,
    // Setters
    setTrade,
    setJobInfo,
    setSupplier,
    setShingleType,
    setMarket,
    setWasteFactor,
    setMeasurement,
    setLaborOverride,
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