// ============================================================
// TradesBot Data Constants
// Design: Roofing Material & Labor Estimator
// ============================================================

export interface ShingleType {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
}

export interface Supplier {
  id: string;
  name: string;
  isPrimary: boolean;
}

export interface MaterialItem {
  id: string;
  lineNumber: number;
  name: string;
  unit: string;
  contributeToSquares: boolean;
  defaultQty: number;
}

export interface LaborItem {
  id: string;
  lineNumber: number;
  name: string;
  unit: string;
  autoFromSquares: boolean;
}

export interface SteepPitchTier {
  id: string;
  label: string;
  multiplier: number;
}

export interface CustomCostItem {
  id: string;
  name: string;
  defaultAmount: number;
  autoDefault: boolean;
}

// Shingle types
export const SHINGLE_TYPES: ShingleType[] = [
  { id: "malarkey-highlander", name: "Malarkey Highlander", manufacturer: "Malarkey", category: "three-tab" },
  { id: "malarkey-vista", name: "Malarkey Vista", manufacturer: "Malarkey", category: "architectural" },
  { id: "iko-cambridge", name: "IKO Cambridge", manufacturer: "IKO", category: "architectural" },
  { id: "certainteed-presidential", name: "CertainTeed Presidential", manufacturer: "CertainTeed", category: "premium" },
  { id: "certainteed-presidential-ir", name: "CertainTeed Presidential IR", manufacturer: "CertainTeed", category: "premium" },
  { id: "malarkey-windsor", name: "Malarkey Windsor", manufacturer: "Malarkey", category: "premium" },
  { id: "gaf-grand-sequoia", name: "GAF Grand Sequoia", manufacturer: "GAF", category: "designer" },
];

// Suppliers
export const SUPPLIERS: Supplier[] = [
  { id: "abc-supply", name: "ABC Supply", isPrimary: true },
  { id: "srs-distribution", name: "SRS Distribution", isPrimary: false },
  { id: "beacon", name: "Beacon", isPrimary: false },
];

// Material items - BUG FIX: Only shingle-bundles contributes to squares
export const MATERIAL_ITEMS: MaterialItem[] = [
  { id: "shingle-bundles", lineNumber: 1, name: "Shingle Bundles", unit: "bundles", contributeToSquares: true, defaultQty: 0 },
  { id: "starter-strip", lineNumber: 2, name: "Starter Strip Bundles", unit: "bundles", contributeToSquares: false, defaultQty: 0 },
  { id: "ridge-cap", lineNumber: 3, name: "Ridge Cap Bundles", unit: "bundles", contributeToSquares: false, defaultQty: 0 },
  { id: "high-profile-ridge", lineNumber: 4, name: "High-Profile Ridge Bundles", unit: "bundles", contributeToSquares: false, defaultQty: 0 },
  { id: "synthetic-underlayment", lineNumber: 5, name: "Synthetic Underlayment Rolls", unit: "rolls", contributeToSquares: false, defaultQty: 0 },
  { id: "ice-water-shield", lineNumber: 6, name: "Ice & Water Shield Rolls", unit: "rolls", contributeToSquares: false, defaultQty: 0 },
  { id: "drip-edge-2x2", lineNumber: 7, name: "Drip Edge 2x2 (10ft)", unit: "sticks", contributeToSquares: false, defaultQty: 0 },
  { id: "drip-edge-d", lineNumber: 8, name: "Drip Edge D-Style (10ft)", unit: "sticks", contributeToSquares: false, defaultQty: 0 },
  { id: "valley-metal", lineNumber: 9, name: "Valley Metal (W-Style)", unit: "sheets", contributeToSquares: false, defaultQty: 0 },
  { id: "step-flashing", lineNumber: 10, name: "Step Flashing", unit: "bundles", contributeToSquares: false, defaultQty: 0 },
  { id: "pipe-jacks", lineNumber: 11, name: "Pipe Jack Boots", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "coil-nails", lineNumber: 12, name: "Coil Nails", unit: "boxes", contributeToSquares: false, defaultQty: 0 },
  { id: "staples", lineNumber: 13, name: "Staple Boxes", unit: "boxes", contributeToSquares: false, defaultQty: 0 },
  { id: "ridge-vent", lineNumber: 14, name: "Ridge Vent", unit: "LF", contributeToSquares: false, defaultQty: 0 },
  { id: "attic-vents-750", lineNumber: 15, name: "750 Attic Vents", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "turbine-vents", lineNumber: 16, name: "Turbine Vents", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "power-vents", lineNumber: 17, name: "Power Vents", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "plumbing-vent-boots", lineNumber: 18, name: "Plumbing Vent Boots", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "caulk-sealant", lineNumber: 19, name: "Caulk / Sealant", unit: "tubes", contributeToSquares: false, defaultQty: 0 },
  { id: "roofing-cement", lineNumber: 20, name: "Roofing Cement", unit: "tubes", contributeToSquares: false, defaultQty: 0 },
  { id: "decking-osb", lineNumber: 21, name: "Decking / OSB Sheets (4x8)", unit: "sheets", contributeToSquares: false, defaultQty: 0 },
  { id: "flashing-rolls", lineNumber: 22, name: "Flashing Rolls (Aluminum)", unit: "rolls", contributeToSquares: false, defaultQty: 0 },
  { id: "chimney-flashing-kit", lineNumber: 23, name: "Chimney Flashing Kit", unit: "kit", contributeToSquares: false, defaultQty: 0 },
  { id: "skylight-flashing-kit", lineNumber: 24, name: "Skylight Flashing Kit", unit: "kit", contributeToSquares: false, defaultQty: 0 },
  { id: "gutter-apron", lineNumber: 25, name: "Gutter Apron (10ft)", unit: "sticks", contributeToSquares: false, defaultQty: 0 },
  { id: "fascia-board", lineNumber: 26, name: "Fascia Board", unit: "pieces", contributeToSquares: false, defaultQty: 0 },
  { id: "drip-edge-rake", lineNumber: 27, name: "Drip Edge Rake (10ft)", unit: "sticks", contributeToSquares: false, defaultQty: 0 },
  { id: "ventilation-baffles", lineNumber: 28, name: "Ventilation Baffles", unit: "each", contributeToSquares: false, defaultQty: 0 },
  { id: "zip-tape", lineNumber: 29, name: "Zip System Tape Rolls", unit: "rolls", contributeToSquares: false, defaultQty: 0 },
  { id: "dumpster-debris", lineNumber: 30, name: "Dumpster / Debris Removal", unit: "each", contributeToSquares: false, defaultQty: 0 },
];

// Labor items
export const LABOR_ITEMS: LaborItem[] = [
  { id: "tear-off", lineNumber: 35, name: "Tear-Off", unit: "per sq", autoFromSquares: true },
  { id: "install-shingles", lineNumber: 36, name: "Install Shingles", unit: "per sq", autoFromSquares: true },
  { id: "install-underlayment", lineNumber: 37, name: "Install Underlayment", unit: "per sq", autoFromSquares: true },
  { id: "install-ice-water", lineNumber: 38, name: "Install Ice & Water Shield", unit: "per sq", autoFromSquares: false },
  { id: "install-drip-edge", lineNumber: 39, name: "Install Drip Edge", unit: "per LF", autoFromSquares: false },
  { id: "install-valley", lineNumber: 40, name: "Install Valley Metal", unit: "per valley", autoFromSquares: false },
  { id: "install-ridge-vent", lineNumber: 41, name: "Install Ridge Vent", unit: "per LF", autoFromSquares: false },
  { id: "install-step-flashing", lineNumber: 42, name: "Install Step Flashing", unit: "per LF", autoFromSquares: false },
  { id: "install-pipe-jacks", lineNumber: 43, name: "Install Pipe Jacks", unit: "each", autoFromSquares: false },
  { id: "install-chimney-flashing", lineNumber: 44, name: "Install Chimney Flashing", unit: "each", autoFromSquares: false },
  { id: "install-skylight-flashing", lineNumber: 45, name: "Install Skylight Flashing", unit: "each", autoFromSquares: false },
  { id: "decking-replacement", lineNumber: 46, name: "Decking Replacement", unit: "per sheet", autoFromSquares: false },
  { id: "haul-off-cleanup", lineNumber: 47, name: "Haul-Off / Cleanup", unit: "flat", autoFromSquares: false },
  { id: "steep-pitch-surcharge", lineNumber: 48, name: "Steep Pitch Surcharge", unit: "per sq", autoFromSquares: true },
  { id: "second-story-surcharge", lineNumber: 49, name: "Second Story Surcharge", unit: "per sq", autoFromSquares: true },
];

// Steep pitch tiers
export const STEEP_PITCH_TIERS: SteepPitchTier[] = [
  { id: "none", label: "Standard (4-7)", multiplier: 0 },
  { id: "8-9", label: "8-9 Pitch", multiplier: 1 },
  { id: "10-11", label: "10-11 Pitch", multiplier: 1.5 },
  { id: "12-plus", label: "12+ Pitch", multiplier: 2 },
  { id: "mansard", label: "Mansard", multiplier: 2.5 },
];

// Custom cost items
export const CUSTOM_COST_ITEMS: CustomCostItem[] = [
  { id: "skylights", name: "Skylights", defaultAmount: 0, autoDefault: false },
  { id: "chimney-flashing", name: "Chimney Flashing", defaultAmount: 0, autoDefault: false },
  { id: "cricket", name: "Cricket", defaultAmount: 50, autoDefault: true },
  { id: "tarp-system", name: "Tarp System", defaultAmount: 50, autoDefault: true },
  { id: "shake-tear-off", name: "Shake Tear-Off", defaultAmount: 0, autoDefault: false },
  { id: "framing-repairs", name: "Framing Repairs", defaultAmount: 0, autoDefault: false },
  { id: "extra-layers", name: "Extra Layers", defaultAmount: 0, autoDefault: false },
];

// Build default state maps
export const DEFAULT_MATERIAL_QTYS: Record<string, number> = {};
MATERIAL_ITEMS.forEach((item) => {
  DEFAULT_MATERIAL_QTYS[item.id] = item.defaultQty;
});

export const DEFAULT_LABOR_COSTS: Record<string, number> = {};
LABOR_ITEMS.forEach((item) => {
  DEFAULT_LABOR_COSTS[item.id] = 0;
});

export const DEFAULT_CUSTOM_COSTS: Record<string, number> = {};
export const DEFAULT_CUSTOM_COST_ENABLED: Record<string, boolean> = {};
CUSTOM_COST_ITEMS.forEach((item) => {
  DEFAULT_CUSTOM_COSTS[item.id] = item.autoDefault ? item.defaultAmount : 0;
  DEFAULT_CUSTOM_COST_ENABLED[item.id] = item.autoDefault;
});

// ============================================================
// Calculation Functions
// ============================================================

/**
 * BUG FIX: Calculate total squares from ONLY shingle bundles.
 * Previously counted starter strip, ridge cap, and high-profile ridge bundles too.
 * Only actual shingle bundles (3 bundles = 1 square) should count.
 */
export function calculateTotalSquares(materialQtys: Record<string, number>): number {
  const totalBundles = MATERIAL_ITEMS
    .filter((item) => item.contributeToSquares)
    .reduce((sum, item) => sum + (materialQtys[item.id] || 0), 0);
  return Math.round((totalBundles / 3) * 100) / 100;
}

/**
 * Calculate labor quantities based on total squares and material quantities.
 */
export function calculateLaborQuantities(
  totalSquares: number,
  materialQtys: Record<string, number>,
  steepPitchTier: string,
  secondStory: boolean
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const item of LABOR_ITEMS) {
    if (item.autoFromSquares) {
      if (item.id === "steep-pitch-surcharge") {
        const tier = STEEP_PITCH_TIERS.find((t) => t.id === steepPitchTier);
        result[item.id] = tier && tier.multiplier > 0 ? totalSquares : 0;
      } else if (item.id === "second-story-surcharge") {
        result[item.id] = secondStory ? totalSquares : 0;
      } else {
        result[item.id] = totalSquares;
      }
    } else {
      switch (item.id) {
        case "install-ice-water":
          result[item.id] = materialQtys["ice-water-shield"] || 0;
          break;
        case "install-drip-edge":
          result[item.id] = (materialQtys["drip-edge-2x2"] || 0) + (materialQtys["drip-edge-d"] || 0) + (materialQtys["drip-edge-rake"] || 0);
          break;
        case "install-valley":
          result[item.id] = materialQtys["valley-metal"] || 0;
          break;
        case "install-ridge-vent":
          result[item.id] = materialQtys["ridge-vent"] || 0;
          break;
        case "install-step-flashing":
          result[item.id] = materialQtys["step-flashing"] || 0;
          break;
        case "install-pipe-jacks":
          result[item.id] = materialQtys["pipe-jacks"] || 0;
          break;
        case "install-chimney-flashing":
          result[item.id] = materialQtys["chimney-flashing-kit"] || 0;
          break;
        case "install-skylight-flashing":
          result[item.id] = materialQtys["skylight-flashing-kit"] || 0;
          break;
        case "decking-replacement":
          result[item.id] = materialQtys["decking-osb"] || 0;
          break;
        case "haul-off-cleanup":
          result[item.id] = totalSquares > 0 ? 1 : 0;
          break;
        default:
          result[item.id] = 0;
      }
    }
  }

  return result;
}
