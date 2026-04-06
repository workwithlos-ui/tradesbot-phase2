import { v4 as uuidv4 } from "uuid";
import type { EstimatorState } from "@/hooks/useEstimator";

export interface SavedEstimate {
  id: string;
  name: string;
  address: string;
  customerName: string;
  totalSquares: number;
  estimateTotal: number;
  createdAt: string;
  updatedAt: string;
  state: EstimatorState;
}

const STORAGE_KEY = "shingles-ai-estimates";

export function getSavedEstimates(): SavedEstimate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedEstimate[];
  } catch {
    return [];
  }
}

export function saveEstimate(
  state: EstimatorState,
  totalSquares: number,
  estimateTotal: number,
  existingId?: string
): SavedEstimate {
  const estimates = getSavedEstimates();
  const now = new Date().toISOString();

  if (existingId) {
    const idx = estimates.findIndex((e) => e.id === existingId);
    if (idx !== -1) {
      estimates[idx] = {
        ...estimates[idx],
        name: state.jobName || "Untitled Estimate",
        address: state.address,
        customerName: state.customerName,
        totalSquares,
        estimateTotal,
        updatedAt: now,
        state,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
      return estimates[idx];
    }
  }

  const newEstimate: SavedEstimate = {
    id: uuidv4(),
    name: state.jobName || "Untitled Estimate",
    address: state.address,
    customerName: state.customerName,
    totalSquares,
    estimateTotal,
    createdAt: now,
    updatedAt: now,
    state,
  };

  estimates.unshift(newEstimate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
  return newEstimate;
}

export function deleteEstimate(id: string): void {
  const estimates = getSavedEstimates().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
}

export function getEstimateById(id: string): SavedEstimate | undefined {
  return getSavedEstimates().find((e) => e.id === id);
}
