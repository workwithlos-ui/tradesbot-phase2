// ============================================================
// TradesBot Data Constants (v2 Upgrade)
// ============================================================

export interface ShingleType {
  id: string;
  name: string;
  manufacturer: string;
  category: "architectural" | "designer";
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
  unitPrice: number;
  contributeToSquares: boolean;
  contributeToLaborSquares: boolean;
  defaultQty: number;
  category: "bundles" | "underlayment" | "flashing" | "ventilation" | "fasteners" | "decking" | "other";
}

export interface LaborItem {
  id: string;
  name: string;
  unit: string;
  defaultCostPerUnit: number;
  isBaseLabor: boolean;
  autoFromSquares: boolean;
  description: string;
}

export interface SteepPitchTier {
  id: string;
  label: string;
  adderPerSquare: number;
}

export interface TradeOption {
  id: string;
  name: string;
  available: boolean;
  description: string;
}

// Trade options for the multi-trade selector
export const TRADE_OPTIONS: TradeOption[] = [
  { id: "shingle-roofing", name: "Shingle Roofing", available: true, description: "Residential shingle roofing estimates" },
  { id: "commercial-flat", name: "Commercial / Flat Roofing", available: false, description: "Commercial and flat roofing estimates" },
  { id: "siding", name: "Siding", available: false, description: "Fascia, soffit, vinyl, hardy, smart siding" },
  { id: "gutters", name: "Gutters", available: false, description: "Gutter installation and repair" },
  { id: "windows", name: "Windows", available: false, description: "Window replacement, United Inches pricing" },
];

// Shingle types (removed three-tab, reclassified per spec)
export const SHINGLE_TYPES: ShingleType[] = [
  { id: "malarkey-highlander", name: "Malarkey Highlander", manufacturer: "Malarkey", category: "architectural" },
  { id: "malarkey-vista", name: "Malarkey Vista", manufacturer: "Malarkey", category: "architectural" },
  { id: "iko-cambridge", name: "IKO Cambridge", manufacturer: "IKO", category: "architectural" },
  { id: "certainteed-presidential", name: "CertainTeed Presidential", manufacturer: "CertainTeed", category: "designer" },
  { id: "certainteed-presidential-ir", name: "CertainTeed Presidential IR", manufacturer: "CertainTeed", category: "designer" },
  { id: "malarkey-windsor", name: "Malarkey Windsor", manufacturer: "Malarkey", category: "designer" },
  { id: "gaf-grand-sequoia", name: "GAF Grand Sequoia", manufacturer: "GAF", category: "designer" },
];

// Suppliers
export const SUPPLIERS: Supplier[] = [
  { id: "abc-supply", name: "ABC Supply", isPrimary: true },
  { id: "srs-distribution", name: "SRS Distribution", isPrimary: false },
  { id: "beacon", name: "Beacon", isPrimary: false },
];

// Material items (fully overhauled per spec)
// Removed: roofing cement, zip system tape, dumpster/debris
// Renamed: drip edge 2x2 -> gutter apron 2x3, plumbing vent boots -> split boot
// Split: flashing rolls -> roll metal 10in + roll metal 20in
// Added: step flashing 8x14, coil nails 1-3/4", lomanco omni roll, lomanco ridge vent pieces,
//        mod bit base sheet, mod bit cap sheet, brone vent, soffit vents, skylight stock/custom
export const MATERIAL_ITEMS: MaterialItem[] = [
  // Bundles
  { id: "shingle-bundles", lineNumber: 1, name: "Shingle Bundles", unit: "bundles", unitPrice: 35, contributeToSquares: true, contributeToLaborSquares: false, defaultQty: 0, category: "bundles" },
  { id: "starter-strip", lineNumber: 2, name: "Starter Strip Bundles", unit: "bundles", unitPrice: 28, contributeToSquares: false, contributeToLaborSquares: true, defaultQty: 0, category: "bundles" },
  { id: "ridge-cap", lineNumber: 3, name: "Ridge Cap Bundles", unit: "bundles", unitPrice: 32, contributeToSquares: false, contributeToLaborSquares: true, defaultQty: 0, category: "bundles" },
  { id: "high-profile-ridge", lineNumber: 4, name: "High-Profile Ridge Bundles", unit: "bundles", unitPrice: 45, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "bundles" },

  // Underlayment
  { id: "synthetic-underlayment", lineNumber: 5, name: "Synthetic Underlayment Rolls", unit: "rolls", unitPrice: 85, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "underlayment" },
  { id: "ice-water-shield", lineNumber: 6, name: "Ice and Water Shield Rolls", unit: "rolls", unitPrice: 110, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "underlayment" },

  // Edge and Apron
  { id: "gutter-apron", lineNumber: 7, name: "Gutter Apron 2x3 (10ft)", unit: "sticks", unitPrice: 8, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "drip-edge-d", lineNumber: 8, name: "Drip Edge Rake D Style (10ft)", unit: "sticks", unitPrice: 7, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },

  // Valley and Flashing
  { id: "valley-metal", lineNumber: 9, name: "Valley Metal (W-Style)", unit: "sheets", unitPrice: 18, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "step-flashing-8x8", lineNumber: 10, name: "Step Flashing 8x8", unit: "bundles", unitPrice: 12, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "step-flashing-8x14", lineNumber: 11, name: "Step Flashing 8x14", unit: "bundles", unitPrice: 18, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "roll-metal-10in", lineNumber: 12, name: "Roll Metal 10in (25 LF)", unit: "rolls", unitPrice: 22, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "roll-metal-20in", lineNumber: 13, name: "Roll Metal 20in (50 LF)", unit: "rolls", unitPrice: 38, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },

  // Pipe and Boots
  { id: "split-boot", lineNumber: 14, name: "Split Boot", unit: "each", unitPrice: 12, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "other" },

  // Fasteners
  { id: "coil-nails-1-25", lineNumber: 15, name: "Coil Nails 1-1/4 inch", unit: "boxes", unitPrice: 45, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "fasteners" },
  { id: "coil-nails-1-75", lineNumber: 16, name: "Coil Nails 1-3/4 inch", unit: "boxes", unitPrice: 48, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "fasteners" },
  { id: "staples", lineNumber: 17, name: "Staple Boxes", unit: "boxes", unitPrice: 35, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "fasteners" },

  // Ventilation
  { id: "lomanco-omni-roll", lineNumber: 18, name: "Lomanco Omni Roll (30ft)", unit: "rolls", unitPrice: 55, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "lomanco-ridge-vent-4ft", lineNumber: 19, name: "Lomanco Ridge Vent Pieces (4ft)", unit: "pieces", unitPrice: 18, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "750-vents", lineNumber: 20, name: "750 Vents", unit: "each", unitPrice: 25, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "turbine-vents", lineNumber: 21, name: "Turbine Vents", unit: "each", unitPrice: 35, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "power-vents", lineNumber: 22, name: "Power Vents", unit: "each", unitPrice: 120, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "brone-vent", lineNumber: 23, name: "Brone Vent", unit: "each", unitPrice: 30, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },
  { id: "soffit-vents", lineNumber: 24, name: "Soffit Vents", unit: "each", unitPrice: 8, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "ventilation" },

  // Sealant
  { id: "caulk-sealant", lineNumber: 25, name: "Caulk / Sealant", unit: "tubes", unitPrice: 6, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "other" },

  // Decking
  { id: "decking-osb", lineNumber: 26, name: "Decking / OSB Sheets (4x8)", unit: "sheets", unitPrice: 28, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "decking" },

  // Flashing Kits
  { id: "chimney-flashing-kit", lineNumber: 27, name: "Chimney Flashing Kit", unit: "kit", unitPrice: 45, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },
  { id: "skylight-flashing-kit", lineNumber: 28, name: "Skylight Flashing Kit", unit: "kit", unitPrice: 65, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "flashing" },

  // Modified Bitumen
  { id: "mod-bit-base-sheet", lineNumber: 29, name: "Modified Bitumen Base Sheet", unit: "rolls", unitPrice: 55, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "underlayment" },
  { id: "mod-bit-cap-sheet", lineNumber: 30, name: "Modified Bitumen Cap Sheet", unit: "rolls", unitPrice: 65, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "underlayment" },

  // Skylight
  { id: "skylight-stock", lineNumber: 31, name: "Skylight (Stock Size)", unit: "each", unitPrice: 350, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "other" },
  { id: "skylight-custom", lineNumber: 32, name: "Skylight (Custom Size)", unit: "each", unitPrice: 600, contributeToSquares: false, contributeToLaborSquares: false, defaultQty: 0, category: "other" },
];

// Labor items (overhauled per spec)
// Base labor rate: $80/square covers tear off, install shingles, underlayment,
// ice/water shield, drip edges, valley metal, pipe jacks, haul off and clean up
export const BASE_LABOR_RATE = 80;

export const LABOR_ITEMS: LaborItem[] = [
  // Base labor (consolidated)
  { id: "base-labor", name: "Base Labor", unit: "per sq", defaultCostPerUnit: 80, isBaseLabor: true, autoFromSquares: true, description: "Tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off and clean up" },

  // Separate labor line items
  { id: "install-ridge-vent", name: "Install Ridge Vent", unit: "per LF", defaultCostPerUnit: 3, isBaseLabor: false, autoFromSquares: false, description: "Ridge vent installation" },
  { id: "install-step-flashing", name: "Install Step Flashing", unit: "per LF", defaultCostPerUnit: 5, isBaseLabor: false, autoFromSquares: false, description: "Step flashing installation per linear foot" },
  { id: "chimney-flashing", name: "Chimney Flashing", unit: "each", defaultCostPerUnit: 120, isBaseLabor: false, autoFromSquares: false, description: "Chimney flashing labor ($120 in STL)" },
  { id: "skylight-flashing", name: "Skylight Flashing", unit: "each", defaultCostPerUnit: 100, isBaseLabor: false, autoFromSquares: false, description: "Skylight flashing labor" },
  { id: "install-skylight", name: "Install Skylight (New)", unit: "each", defaultCostPerUnit: 250, isBaseLabor: false, autoFromSquares: false, description: "New skylight installation" },
  { id: "decking-replacement", name: "Decking Replacement", unit: "per sheet", defaultCostPerUnit: 75, isBaseLabor: false, autoFromSquares: false, description: "OSB decking replacement per sheet" },
  { id: "cricket", name: "Cricket", unit: "each", defaultCostPerUnit: 100, isBaseLabor: false, autoFromSquares: false, description: "Cricket installation ($100)" },
  { id: "framing-repairs", name: "Framing Repairs", unit: "custom", defaultCostPerUnit: 0, isBaseLabor: false, autoFromSquares: false, description: "Custom framing repair costs" },
  { id: "shake-tear-off", name: "Shake Tear Off", unit: "per sq", defaultCostPerUnit: 25, isBaseLabor: false, autoFromSquares: false, description: "Additional charge for shake/wood shingle tear off" },
  { id: "cut-in-turtle-vents", name: "Cut in Turtle Vents", unit: "each", defaultCostPerUnit: 35, isBaseLabor: false, autoFromSquares: false, description: "Cut in and install turtle vents" },
  { id: "cut-in-ridge-vents", name: "Cut in Ridge Vents", unit: "per LF", defaultCostPerUnit: 4, isBaseLabor: false, autoFromSquares: false, description: "Cut in ridge vent opening" },
  { id: "mod-bit-install", name: "Modified Bitumen Installation", unit: "per sq", defaultCostPerUnit: 100, isBaseLabor: false, autoFromSquares: false, description: "Mod bit installation ($100/sq, includes $20 adder over base)" },
  { id: "detach-reset-gutter", name: "Detach and Reset Gutter", unit: "per LF", defaultCostPerUnit: 3, isBaseLabor: false, autoFromSquares: false, description: "Detach and reset gutter charge" },
  { id: "two-story-charge", name: "Two Story Charge", unit: "per sq", defaultCostPerUnit: 10, isBaseLabor: false, autoFromSquares: false, description: "Additional charge for two story homes" },
  { id: "hand-load", name: "Hand Load", unit: "per sq", defaultCostPerUnit: 5, isBaseLabor: false, autoFromSquares: false, description: "Hand load materials ($5/square)" },
  { id: "access-charge", name: "Access Charge", unit: "flat", defaultCostPerUnit: 150, isBaseLabor: false, autoFromSquares: false, description: "Dump trailer access fee, drag trash charge" },
];

// Steep pitch tiers (now with per-square adders instead of multipliers)
export const STEEP_PITCH_TIERS: SteepPitchTier[] = [
  { id: "8-9", label: "8-9 Pitch", adderPerSquare: 15 },
  { id: "10-11", label: "10-11 Pitch", adderPerSquare: 25 },
  { id: "12-plus", label: "12+ Pitch", adderPerSquare: 40 },
  { id: "mansard", label: "Mansard", adderPerSquare: 50 },
];

// Build default state maps
export const DEFAULT_MATERIAL_QTYS: Record<string, number> = {};
MATERIAL_ITEMS.forEach((item) => {
  DEFAULT_MATERIAL_QTYS[item.id] = item.defaultQty;
});

export const DEFAULT_LABOR_QTYS: Record<string, number> = {};
LABOR_ITEMS.forEach((item) => {
  DEFAULT_LABOR_QTYS[item.id] = 0;
});

export const DEFAULT_LABOR_COSTS: Record<string, number> = {};
LABOR_ITEMS.forEach((item) => {
  DEFAULT_LABOR_COSTS[item.id] = item.defaultCostPerUnit;
});

// ============================================================
// Calculation Functions
// ============================================================

/**
 * Calculate total squares from shingle bundles only (3 bundles = 1 square).
 * This is used for material ordering purposes.
 */
export function calculateShingleSquares(materialQtys: Record<string, number>): number {
  const bundles = materialQtys["shingle-bundles"] || 0;
  return Math.round((bundles / 3) * 100) / 100;
}

/**
 * Calculate total squares for LABOR purposes.
 * Includes shingle bundles + starter strip + ridge cap bundles.
 * (All bundles that go on the roof count toward labor squares.)
 */
export function calculateLaborSquares(materialQtys: Record<string, number>): number {
  const shingleBundles = materialQtys["shingle-bundles"] || 0;
  const starterBundles = materialQtys["starter-strip"] || 0;
  const ridgeCapBundles = materialQtys["ridge-cap"] || 0;
  const totalBundles = shingleBundles + starterBundles + ridgeCapBundles;
  return Math.round((totalBundles / 3) * 100) / 100;
}

/**
 * Calculate steep pitch adder based on squares at each pitch tier.
 */
export function calculateSteepPitchAdder(steepPitchSquares: Record<string, number>): number {
  let total = 0;
  for (const tier of STEEP_PITCH_TIERS) {
    const sq = steepPitchSquares[tier.id] || 0;
    total += sq * tier.adderPerSquare;
  }
  return total;
}

/**
 * Calculate total material cost from quantities and unit prices.
 */
export function calculateMaterialCost(materialQtys: Record<string, number>): number {
  let total = 0;
  for (const item of MATERIAL_ITEMS) {
    const qty = materialQtys[item.id] || 0;
    total += qty * item.unitPrice;
  }
  return total;
}

/**
 * Calculate total labor cost.
 */
export function calculateTotalLaborCost(
  laborSquares: number,
  laborQtys: Record<string, number>,
  laborCosts: Record<string, number>,
  steepPitchSquares: Record<string, number>
): number {
  let total = 0;

  // Base labor
  total += laborSquares * (laborCosts["base-labor"] || BASE_LABOR_RATE);

  // Steep pitch adder
  total += calculateSteepPitchAdder(steepPitchSquares);

  // Additional labor items
  for (const item of LABOR_ITEMS) {
    if (item.isBaseLabor) continue;
    const qty = laborQtys[item.id] || 0;
    const cost = laborCosts[item.id] || item.defaultCostPerUnit;
    total += qty * cost;
  }

  return total;
}

// Legacy compatibility: calculate total squares (uses shingle bundles only for display)
export function calculateTotalSquares(materialQtys: Record<string, number>): number {
  return calculateShingleSquares(materialQtys);
}

// Legacy compatibility
export function calculateLaborQuantities(
  totalSquares: number,
  materialQtys: Record<string, number>,
  steepPitchTier: string,
  secondStory: boolean
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of LABOR_ITEMS) {
    result[item.id] = 0;
  }
  return result;
}

// Custom cost items (updated per spec)
export interface CustomCostItem {
  id: string;
  name: string;
  defaultAmount: number;
  autoDefault: boolean;
}

export const CUSTOM_COST_ITEMS: CustomCostItem[] = [
  { id: "delivery", name: "Delivery", defaultAmount: 95, autoDefault: false },
];

export const DEFAULT_CUSTOM_COSTS: Record<string, number> = {};
export const DEFAULT_CUSTOM_COST_ENABLED: Record<string, boolean> = {};
CUSTOM_COST_ITEMS.forEach((item) => {
  DEFAULT_CUSTOM_COSTS[item.id] = item.defaultAmount;
  DEFAULT_CUSTOM_COST_ENABLED[item.id] = item.autoDefault;
});
