// ============================================================
// Shingles.ai Data Layer v5 -- Multi-Pitch + Ryan's Corrections
// ============================================================

// ---- Interfaces ----

export interface ShingleType {
  id: string;
  name: string;
  manufacturer: string;
  category: "architectural" | "designer" | "specialty";
  bundlesPerSquare: number;
  starterLfPerBundle: number; // designer starters have different LF
  nailSize: "1-1/4" | "1-3/4"; // Ryan: architectural = 1 1/4", designer/specialty = 1 3/4"
}

export interface Supplier {
  id: string;
  name: string;
  isPrimary: boolean;
}

export interface TradeOption {
  id: string;
  name: string;
  available: boolean;
  description: string;
}

export interface MarketConfig {
  id: string;
  name: string;
  baseLaborRate: number;
  description: string;
}

export interface PitchTier {
  id: string;
  label: string;
  adderPerSquare: number;
}

export interface VentOption {
  id: string;
  name: string;
  type: "exhaust" | "intake" | "accessory";
  unit: string;
  unitPrice: number;
}

export interface AdditionalCostItem {
  id: string;
  description: string;
  amount: number;
}

// ---- Roof Measurements (the new input model) ----

export interface RoofMeasurements {
  // Multi-pitch squares (Ryan: roofs have multiple pitch zones)
  pitchBaseSq: number;     // 4-7 pitch (standard, no adder)
  pitch89Sq: number;       // 8-9 pitch (+$10/SQ)
  pitch1011Sq: number;     // 10-11 pitch (+$20/SQ)
  pitch12PlusSq: number;   // 12+ pitch (+$30/SQ)
  pitchMansardSq: number;  // mansard (+$40/SQ)
  // totalSquares is computed: sum of all pitch zones (used for materials)
  stories: number; // 1 or 2
  eavesLf: number;
  ridgeLf: number;
  hipsLf: number;
  hipRidgeProfile: "standard" | "high-profile";
  valleysLf: number;
  rakesLf: number;
  stepFlashingLf: number;
  wallFlashingLf: number;
  chimneyCount: number;
  skylightCount: number;
  skylightType: "curb-mount" | "deck-mount";
  pipeJackCount: number;
  splitBootCount: number;
  ezPlugCount: number;
  bathroomVentCount: number;
  // Ventilation choices
  exhaustVentType: string; // id from VENT_OPTIONS
  exhaustVentQty: number;
  intakeVentType: string;
  intakeVentQty: number;
  // Decking
  deckingAction: "none" | "tear-off" | "overlay";
  deckingSheetsOverride: number; // manual override, 0 = auto-calc
  // Conditions
  shakeTearoff: boolean;
  additionalLayers: number; // 0, 1, 2 (extra layers of shingles/felt)
  handLoad: boolean;
  noDumpsterAccess: boolean;
  // Caulk and paint
  caulkTubes: number;
  sprayPaintCans: number;
}

// Helper to compute total squares from multi-pitch zones
export function getTotalSquares(m: RoofMeasurements): number {
  return (m.pitchBaseSq || 0) + (m.pitch89Sq || 0) + (m.pitch1011Sq || 0) + (m.pitch12PlusSq || 0) + (m.pitchMansardSq || 0);
}

// ---- Constants ----

export const TRADE_OPTIONS: TradeOption[] = [
  { id: "shingle-roofing", name: "Shingle Roofing", available: true, description: "Residential shingle roofing estimates" },
  { id: "commercial-flat", name: "Commercial / Flat Roofing", available: false, description: "Commercial and flat roofing estimates" },
  { id: "siding", name: "Siding", available: false, description: "Fascia, soffit, vinyl, hardy, smart siding" },
  { id: "gutters", name: "Gutters", available: false, description: "Gutter installation and repair" },
  { id: "windows", name: "Windows", available: false, description: "Window replacement, United Inches pricing" },
];

export const MARKET_CONFIGS: MarketConfig[] = [
  { id: "stl", name: "St. Louis, MO", baseLaborRate: 80, description: "Standard STL market rate" },
  { id: "kc", name: "Kansas City, MO", baseLaborRate: 80, description: "KC market rate" },
];

// Shingle types with bundles-per-square
// 3 bundles = standard architectural
// 4 bundles = Malarkey Legacy, GAF Camelot II, CertainTeed Belmont
// 5 bundles = Malarkey Windsor, CertainTeed Presidential, Presidential IR, Grand Manor, GAF Grand Sequoia
// 6 bundles = CertainTeed Presidential TL
// Ryan's categories:
// Architectural (3 bndl/sq, 1 1/4" nails): Highlander, Vista, IKO Cambridge
// Specialty (4 bndl/sq, 1 3/4" nails): Legacy, Camelot II, Belmont
// Designer (4-6 bndl/sq, 1 3/4" nails): Presidential, Windsor, Grand Sequoia, etc.
export const SHINGLE_TYPES: ShingleType[] = [
  // --- Architectural (3 bundles/SQ, 1 1/4" coil) ---
  { id: "malarkey-highlander", name: "Malarkey Highlander", manufacturer: "Malarkey", category: "architectural", bundlesPerSquare: 3, starterLfPerBundle: 110, nailSize: "1-1/4" },
  { id: "malarkey-vista", name: "Malarkey Vista", manufacturer: "Malarkey", category: "architectural", bundlesPerSquare: 3, starterLfPerBundle: 110, nailSize: "1-1/4" },
  { id: "iko-cambridge", name: "IKO Cambridge", manufacturer: "IKO", category: "architectural", bundlesPerSquare: 3, starterLfPerBundle: 110, nailSize: "1-1/4" },
  // --- Specialty (4 bundles/SQ, 1 3/4" coil) ---
  { id: "malarkey-legacy", name: "Malarkey Legacy", manufacturer: "Malarkey", category: "specialty", bundlesPerSquare: 4, starterLfPerBundle: 70, nailSize: "1-3/4" },
  { id: "gaf-camelot-ii", name: "GAF Camelot II", manufacturer: "GAF", category: "specialty", bundlesPerSquare: 4, starterLfPerBundle: 60, nailSize: "1-3/4" },
  { id: "certainteed-belmont", name: "CertainTeed Belmont", manufacturer: "CertainTeed", category: "specialty", bundlesPerSquare: 4, starterLfPerBundle: 35, nailSize: "1-3/4" },
  // --- Designer (5-6 bundles/SQ, 1 3/4" coil) ---
  { id: "certainteed-presidential", name: "CertainTeed Presidential", manufacturer: "CertainTeed", category: "designer", bundlesPerSquare: 5, starterLfPerBundle: 35, nailSize: "1-3/4" },
  { id: "certainteed-presidential-ir", name: "CertainTeed Presidential IR", manufacturer: "CertainTeed", category: "designer", bundlesPerSquare: 5, starterLfPerBundle: 35, nailSize: "1-3/4" },
  { id: "certainteed-presidential-tl", name: "CertainTeed Presidential TL", manufacturer: "CertainTeed", category: "designer", bundlesPerSquare: 6, starterLfPerBundle: 35, nailSize: "1-3/4" },
  { id: "certainteed-grand-manor", name: "CertainTeed Grand Manor", manufacturer: "CertainTeed", category: "designer", bundlesPerSquare: 5, starterLfPerBundle: 35, nailSize: "1-3/4" },
  { id: "malarkey-windsor", name: "Malarkey Windsor", manufacturer: "Malarkey", category: "designer", bundlesPerSquare: 5, starterLfPerBundle: 70, nailSize: "1-3/4" },
  { id: "gaf-grand-sequoia", name: "GAF Grand Sequoia", manufacturer: "GAF", category: "designer", bundlesPerSquare: 5, starterLfPerBundle: 60, nailSize: "1-3/4" },
];

export const SUPPLIERS: Supplier[] = [
  { id: "abc-supply", name: "ABC Supply", isPrimary: true },
  { id: "srs-distribution", name: "SRS Distribution", isPrimary: false },
  { id: "beacon", name: "Beacon", isPrimary: false },
];

// KC Pitch pricing (adder per square)
export const PITCH_TIERS: PitchTier[] = [
  { id: "standard", label: "4-7 (Standard)", adderPerSquare: 0 },
  { id: "8-9", label: "8-9 Pitch", adderPerSquare: 10 },
  { id: "10-11", label: "10-11 Pitch", adderPerSquare: 20 },
  { id: "12-plus", label: "12+ Pitch", adderPerSquare: 30 },
  { id: "mansard", label: "Mansard", adderPerSquare: 40 },
];

// Ventilation options (Ryan's list)
export const VENT_OPTIONS: VentOption[] = [
  // Exhaust (choose only one type per roof)
  { id: "lomanco-750", name: "750 Vent", type: "exhaust", unit: "each", unitPrice: 25 },
  { id: "turbine-vent", name: "Turbine Vent", type: "exhaust", unit: "each", unitPrice: 35 },
  { id: "power-vent", name: "Power Vent", type: "exhaust", unit: "each", unitPrice: 125 },
  { id: "omni-roll-30ft", name: "Lomanco Omni Roll (30 LF)", type: "exhaust", unit: "rolls", unitPrice: 55 },
  { id: "omni-ridge-4ft", name: "Lomanco Ridge Vent (4ft sticks)", type: "exhaust", unit: "pieces", unitPrice: 18 },
  // Intake
  { id: "soffit-vent", name: "Soffit Vent", type: "intake", unit: "each", unitPrice: 8 },
  { id: "ventilation-baffle", name: "Ventilation Baffle", type: "intake", unit: "each", unitPrice: 4 },
  // Accessory
  { id: "broan-vent", name: "Broan Vent", type: "accessory", unit: "each", unitPrice: 30 },
];

// ---- Material Pricing (KC prices from Ryan) ----

export const MATERIAL_PRICES = {
  // Shingle bundles -- price TBD from ABC updated list, placeholder
  shingleBundle: 0, // will be per-shingle-type later
  // Starter
  starterBundle: 68.49,
  starterLfPerBundle: 110, // standard, overridden by shingle type
  // Hip & Ridge
  hipRidgeStandardLfPerBundle: 31,
  hipRidgeHighProfileLfPerBundle: 20,
  hipRidgeStandardPrice: 32, // per bundle
  hipRidgeHighProfilePrice: 45, // per bundle
  // Ice & Water Shield
  iceWaterLfPerRoll: 66.6,
  iceWaterPricePerRoll: 62,
  // Synthetic Felt / Underlayment
  syntheticSqPerRoll: 2,
  syntheticPricePerRoll: 77.65,
  // Gutter Apron 2x3
  gutterApronLfPerStick: 10,
  gutterApronPricePerStick: 7.89,
  // D Style Drip Edge 1x2
  dripEdgeLfPerStick: 10,
  dripEdgePricePerStick: 7.69,
  // Valley Metal 24" W Style
  valleyMetalLfPerStick: 10,
  valleyMetalPricePerStick: 36.50,
  valleyWastePercent: 15, // 15-20% vs standard 8%
  // Step Flashing 8x8
  stepFlashing8x8PricePerBundle: 12,
  stepFlashing8x8PcsPerBundle: 100,
  stepFlashing8x8PcsPerLf: 1.5, // ~1.5 pieces per LF
  // Step Flashing 8x14 (for curb mount skylights)
  stepFlashing8x14PricePerBundle: 18,
  // Roll Metal 10" (25 LF)
  rollMetal10PricePerRoll: 22,
  rollMetal10LfPerRoll: 25,
  // Roll Metal 20" (50 LF)
  rollMetal20PricePerRoll: 38,
  rollMetal20LfPerRoll: 50,
  // Nails
  coilNails125PricePerBox: 49.99,
  coilNails125SqPerBox: 15,
  coilNails175PricePerBox: 291.99, // designer
  coilNails175SqPerBox: 15,
  // Staples
  staples38PricePerBox: 7.95,
  staples38SqPerBox: 15,
  staples2inPricePerBox: 93.99, // decking
  staples2inSqPerBox: 15,
  // Pipe Jack
  pipeJackPrice: 12,
  // Split Boot
  splitBootPrice: 12,
  // EZ Plug
  ezPlugPrice: 8,
  // Caulk
  caulkPrice: 6,
  // Spray Paint
  sprayPaintPrice: 5,
  // Decking OSB 4x8
  deckingSheetPrice: 28,
  deckingSheetsPerSquare: 3,
  // Modified Bitumen
  modBitBaseSqPerRoll: 2, // 1 roll = 2 SQ
  modBitBasePrice: 55,
  modBitCapSqPerRoll: 1, // 1 roll = 1 SQ
  modBitCapPrice: 65,
};

// ---- Labor Pricing (KC from Ryan) ----

export const BASE_LABOR_RATE = 80; // $/sq standard

export interface LaborLineItem {
  id: string;
  name: string;
  unit: string;
  rate: number;
  description: string;
}

// Reference list of all possible labor line items with default rates (Ryan's spec)
export const LABOR_LINE_ITEMS: LaborLineItem[] = [
  { id: "base-labor", name: "Base Labor (all-inclusive)", unit: "per sq", rate: 80, description: "Tear off, install shingles, underlayment, I&W, drip edge, valley metal, pipe jacks, haul off & cleanup" },
  { id: "additional-shingle-tearoff", name: "Additional Layer Shingle Tear Off", unit: "per sq", rate: 10, description: "Extra layer of shingle removal" },
  { id: "additional-felt-tearoff", name: "Additional Layer Felt Tear Off", unit: "per sq", rate: 5, description: "Extra layer of felt removal" },
  { id: "cedar-shake-tearoff", name: "Cedar Shake Tear Off", unit: "per sq", rate: 15, description: "Tear off cedar shake" },
  { id: "install-decking", name: "Install Decking (over existing)", unit: "per sheet", rate: 20, description: "Install new decking sheets" },
  { id: "remove-install-decking", name: "Remove + Install Decking", unit: "per sheet", rate: 30, description: "Remove old and install new decking" },
  { id: "chimney-flashing", name: "Chimney Flashing", unit: "each", rate: 120, description: "Flash around chimney" },
  { id: "skylight-flashing", name: "Skylight Flashing", unit: "each", rate: 120, description: "Flash around skylight" },
  { id: "build-cricket", name: "Build Cricket", unit: "each", rate: 100, description: "Build cricket behind chimney" },
  { id: "cut-turtle-vent", name: "Cut in Turtle Vent", unit: "each", rate: 10, description: "Cut in and install turtle vent" },
  { id: "cut-ridge-vent", name: "Cut in Ridge Vent", unit: "per LF", rate: 7, description: "Cut in ridge vent opening" },
  { id: "install-ridge-vent", name: "Install Ridge Vent", unit: "per LF", rate: 2, description: "Install ridge vent material" },
  { id: "mod-bit-install", name: "Modified Bitumen Install", unit: "per sq", rate: 20, description: "Install modified bitumen (+$20/SQ extra, $100/SQ total)" },
  { id: "two-story", name: "Two Story Charge", unit: "per sq", rate: 10, description: "Additional for 2-story buildings" },
  { id: "hand-load", name: "Hand Load", unit: "per sq", rate: 5, description: "Hand load materials to roof" },
];

export const TARP_SYSTEM_CHARGE = 0; // Removed — haul off / cleanup included in $80/SQ base labor
export const WASTE_FACTOR_DEFAULT = 8;
export const WASTE_FACTOR_MIN = 4;
export const WASTE_FACTOR_MAX = 15;

// ---- Default Measurements ----

export function getDefaultMeasurements(): RoofMeasurements {
  return {
    pitchBaseSq: 0,
    pitch89Sq: 0,
    pitch1011Sq: 0,
    pitch12PlusSq: 0,
    pitchMansardSq: 0,
    stories: 1,
    eavesLf: 0,
    ridgeLf: 0,
    hipsLf: 0,
    hipRidgeProfile: "standard",
    valleysLf: 0,
    rakesLf: 0,
    stepFlashingLf: 0,
    wallFlashingLf: 0,
    chimneyCount: 0,
    skylightCount: 0,
    skylightType: "curb-mount",
    pipeJackCount: 0,
    splitBootCount: 0,
    ezPlugCount: 0,
    bathroomVentCount: 0,
    exhaustVentType: "",
    exhaustVentQty: 0,
    intakeVentType: "",
    intakeVentQty: 0,
    deckingAction: "none",
    deckingSheetsOverride: 0,
    shakeTearoff: false,
    additionalLayers: 0,
    handLoad: false,
    noDumpsterAccess: false,
    caulkTubes: 2,
    sprayPaintCans: 1,
  };
}// ============================================================
// AUTO-CALCULATION ENGINE
// ============================================================

export interface CalculatedMaterials {
  // Shingles
  shingleBundles: number;
  shingleBundlesBase: number; // before waste
  // Starter
  starterBundles: number;
  // Hip & Ridge
  hipRidgeBundles: number;
  // Ice & Water
  iceWaterRolls: number;
  // Synthetic Underlayment
  syntheticRolls: number;
  // Gutter Apron
  gutterApronSticks: number;
  // Drip Edge
  dripEdgeSticks: number;
  // Valley Metal
  valleyMetalSticks: number;
  // Step Flashing 8x8
  stepFlashing8x8Bundles: number;
  // Step Flashing 8x14 (curb mount skylights)
  stepFlashing8x14Bundles: number;
  // Roll Metal 10"
  rollMetal10Rolls: number;
  // Roll Metal 20"
  rollMetal20Rolls: number;
  // Nails
  nailBoxes: number;
  nailType: "1-1/4" | "1-3/4";
  // Staples
  stapleBoxes: number;
  // Pipe Jacks
  pipeJacks: number;
  // Split Boots
  splitBoots: number;
  // EZ Plugs
  ezPlugs: number;
  // Bathroom Vents
  bathroomVents: number;
  // Caulk
  caulkTubes: number;
  // Spray Paint
  sprayPaintCans: number;
  // Decking
  deckingSheets: number;
  deckingStapleBoxes: number;
  // Modified Bitumen
  modBitBaseRolls: number;
  modBitCapRolls: number;
  // Ventilation
  exhaustVentQty: number;
  exhaustVentType: string;
  intakeVentQty: number;
  intakeVentType: string;
}

export function calculateMaterials(
  measurements: RoofMeasurements,
  shingleType: ShingleType,
  wasteFactor: number
): CalculatedMaterials {
  const P = MATERIAL_PRICES;
  const wf = 1 + wasteFactor / 100;
  const isDesigner = shingleType.category === "designer" || shingleType.category === "specialty";
  const totalSquares = getTotalSquares(measurements);
  const needsModBit = false; // mod bit is manual, not auto from pitch

  // Shingle bundles
  const shingleBundlesBase = totalSquares * shingleType.bundlesPerSquare;
  const shingleBundles = Math.ceil(shingleBundlesBase * wf);

  // Starter: eaves LF / LF per bundle (varies by shingle type)
  const starterLf = measurements.eavesLf + (isDesigner ? measurements.rakesLf : 0);
  const starterBundles = starterLf > 0 ? Math.ceil(starterLf / shingleType.starterLfPerBundle) : 0;

  // Hip & Ridge: (ridge LF + hips LF) / LF per bundle
  const totalRidgeHipLf = measurements.ridgeLf + measurements.hipsLf;
  const lfPerBundle = measurements.hipRidgeProfile === "high-profile"
    ? P.hipRidgeHighProfileLfPerBundle
    : P.hipRidgeStandardLfPerBundle;
  const hipRidgeBundles = totalRidgeHipLf > 0 ? Math.ceil(totalRidgeHipLf / lfPerBundle) : 0;

  // Ice & Water Shield: (eaves + eaves + valleys) / 66.6 LF per roll
  // Double eaves for 2 rows at eaves, valleys get 1 row
  // Add extra for chimneys and skylights
  const iceWaterLf = (measurements.eavesLf * 2) + measurements.valleysLf;
  const iceWaterExtra = (measurements.chimneyCount * 20) + (measurements.skylightCount * 15);
  const iceWaterRolls = (iceWaterLf + iceWaterExtra) > 0
    ? Math.ceil((iceWaterLf + iceWaterExtra) / P.iceWaterLfPerRoll)
    : 0;

  // Synthetic Underlayment: total squares minus I&W coverage
  const iceWaterSqCoverage = iceWaterRolls > 0 ? iceWaterRolls * (P.iceWaterLfPerRoll / 100) : 0;
  const syntheticSqNeeded = Math.max(0, totalSquares - iceWaterSqCoverage);
  const syntheticRolls = syntheticSqNeeded > 0
    ? Math.ceil(syntheticSqNeeded / P.syntheticSqPerRoll)
    : 0;

  // Gutter Apron: eaves / 10 + waste
  const gutterApronSticks = measurements.eavesLf > 0
    ? Math.ceil((measurements.eavesLf / P.gutterApronLfPerStick) * wf)
    : 0;

  // D Style Drip Edge: rakes / 10 + waste
  const dripEdgeSticks = measurements.rakesLf > 0
    ? Math.ceil((measurements.rakesLf / P.dripEdgeLfPerStick) * wf)
    : 0;

  // Valley Metal: valleys / 10 + 15-20% waste (use valley-specific waste)
  const valleyWf = 1 + P.valleyWastePercent / 100;
  const valleyMetalSticks = measurements.valleysLf > 0
    ? Math.ceil((measurements.valleysLf / P.valleyMetalLfPerStick) * valleyWf)
    : 0;

  // Step Flashing 8x8: step flashing LF * 1.5 pcs/LF / 100 pcs per bundle
  // Also needed for chimneys
  const stepPcs = (measurements.stepFlashingLf * P.stepFlashing8x8PcsPerLf)
    + (measurements.chimneyCount * 30); // ~30 pcs per chimney
  const stepFlashing8x8Bundles = stepPcs > 0 ? Math.ceil(stepPcs / P.stepFlashing8x8PcsPerBundle) : 0;

  // Step Flashing 8x14: only for curb-mount skylights
  const stepFlashing8x14Bundles = (measurements.skylightType === "curb-mount" && measurements.skylightCount > 0)
    ? Math.ceil(measurements.skylightCount * 0.5) // ~0.5 bundle per skylight
    : 0;

  // Roll Metal 10": wall flashing LF / 25 LF per roll
  const rollMetal10Rolls = measurements.wallFlashingLf > 0
    ? Math.ceil(measurements.wallFlashingLf / P.rollMetal10LfPerRoll)
    : 0;

  // Roll Metal 20": chimneys + curb-mount skylights
  const rollMetal20Lf = (measurements.chimneyCount * 15) +
    (measurements.skylightType === "curb-mount" ? measurements.skylightCount * 10 : 0);
  const rollMetal20Rolls = rollMetal20Lf > 0
    ? Math.ceil(rollMetal20Lf / P.rollMetal20LfPerRoll)
    : 0;

  // Nails: use nailSize from shingle type (Ryan's correction)
  const nailType = shingleType.nailSize;
  const nailBoxes = totalSquares > 0
    ? Math.ceil(totalSquares / 15)
    : 0;

  // Staples: 3/8" for underlayment
  const stapleBoxes = totalSquares > 0
    ? Math.ceil(totalSquares / 15)
    : 0;

  // Decking staples: 2" for re-deck
  let deckingStapleBoxes = 0;

  // Decking
  let deckingSheets = 0;
  if (measurements.deckingAction !== "none") {
    if (measurements.deckingSheetsOverride > 0) {
      deckingSheets = measurements.deckingSheetsOverride;
    } else {
      deckingSheets = Math.ceil(totalSquares * P.deckingSheetsPerSquare * wf);
    }
    // 2" decking staples needed when decking
    deckingStapleBoxes = totalSquares > 0 ? Math.ceil(totalSquares / 15) : 0;
  }

  // Modified Bitumen — not auto from pitch; user adds manually via mod bit material fields
  let modBitBaseRolls = 0;
  let modBitCapRolls = 0;

  return {
    shingleBundles,
    shingleBundlesBase,
    starterBundles,
    hipRidgeBundles,
    iceWaterRolls,
    syntheticRolls,
    gutterApronSticks,
    dripEdgeSticks,
    valleyMetalSticks,
    stepFlashing8x8Bundles,
    stepFlashing8x14Bundles,
    rollMetal10Rolls,
    rollMetal20Rolls,
    nailBoxes,
    nailType,
    stapleBoxes,
    pipeJacks: measurements.pipeJackCount,
    splitBoots: measurements.splitBootCount,
    ezPlugs: measurements.ezPlugCount,
    bathroomVents: measurements.bathroomVentCount,
    caulkTubes: measurements.caulkTubes,
    sprayPaintCans: measurements.sprayPaintCans,
    deckingSheets,
    deckingStapleBoxes,
    modBitBaseRolls,
    modBitCapRolls,
    exhaustVentQty: measurements.exhaustVentQty,
    exhaustVentType: measurements.exhaustVentType,
    intakeVentQty: measurements.intakeVentQty,
    intakeVentType: measurements.intakeVentType,
  };
}// ---- Material Cost Calculation ----

export interface MaterialCostLine {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export function calculateMaterialCostLines(
  calc: CalculatedMaterials,
  shingleType: ShingleType,
  measurements: RoofMeasurements
): MaterialCostLine[] {
  const P = MATERIAL_PRICES;
  const usesThickNails = shingleType.nailSize === "1-3/4";
  const lines: MaterialCostLine[] = [];

  const add = (id: string, name: string, qty: number, unit: string, unitPrice: number) => {
    if (qty > 0) {
      lines.push({ id, name, qty, unit, unitPrice, total: qty * unitPrice });
    }
  };

  // Shingles (price TBD, using 0 placeholder until ABC list arrives)
  add("shingle-bundles", `${shingleType.name} Bundles`, calc.shingleBundles, "bundles", P.shingleBundle);
  add("starter-bundles", "Starter Strip Bundles", calc.starterBundles, "bundles", P.starterBundle);

  // Hip & Ridge
  if (measurements.hipRidgeProfile === "high-profile") {
    add("hip-ridge", "High-Profile Hip & Ridge", calc.hipRidgeBundles, "bundles", P.hipRidgeHighProfilePrice);
  } else {
    add("hip-ridge", "Standard Hip & Ridge", calc.hipRidgeBundles, "bundles", P.hipRidgeStandardPrice);
  }

  // Ice & Water
  add("ice-water", "Ice & Water Shield", calc.iceWaterRolls, "rolls", P.iceWaterPricePerRoll);
  // Synthetic Underlayment
  add("synthetic-felt", "Synthetic Underlayment", calc.syntheticRolls, "rolls", P.syntheticPricePerRoll);
  // Gutter Apron
  add("gutter-apron", "Gutter Apron 2x3 (10ft)", calc.gutterApronSticks, "sticks", P.gutterApronPricePerStick);
  // Drip Edge
  add("drip-edge", "D Style Drip Edge 1x2 (10ft)", calc.dripEdgeSticks, "sticks", P.dripEdgePricePerStick);
  // Valley Metal
  add("valley-metal", "Valley Metal 24\" W Style (10ft)", calc.valleyMetalSticks, "sticks", P.valleyMetalPricePerStick);
  // Step Flashing
  add("step-8x8", "Step Flashing 8x8", calc.stepFlashing8x8Bundles, "bundles", P.stepFlashing8x8PricePerBundle);
  add("step-8x14", "Step Flashing 8x14", calc.stepFlashing8x14Bundles, "bundles", P.stepFlashing8x14PricePerBundle);
  // Roll Metal
  add("roll-metal-10", "Roll Metal 10\" (25 LF)", calc.rollMetal10Rolls, "rolls", P.rollMetal10PricePerRoll);
  add("roll-metal-20", "Roll Metal 20\" (50 LF)", calc.rollMetal20Rolls, "rolls", P.rollMetal20PricePerRoll);
  // Nails (type determined by shingle selection)
  if (usesThickNails) {
    add("nails", "Coil Nails 1-3/4\"", calc.nailBoxes, "boxes", P.coilNails175PricePerBox);
  } else {
    add("nails", "Coil Nails 1-1/4\"", calc.nailBoxes, "boxes", P.coilNails125PricePerBox);
  }
  // Staples 3/8" (underlayment)
  add("staples", "Staples 3/8\"", calc.stapleBoxes, "boxes", P.staples38PricePerBox);
  // Decking Staples 2" (only when decking work)
  add("decking-staples", "Decking Staples 2\"", calc.deckingStapleBoxes, "boxes", P.staples2inPricePerBox);
  // Pipe Jacks
  add("pipe-jacks", "Pipe Jacks", calc.pipeJacks, "each", P.pipeJackPrice);
  // Split Boots
  add("split-boots", "Split Boots", calc.splitBoots, "each", P.splitBootPrice);
  // EZ Plugs
  add("ez-plugs", "EZ Plugs", calc.ezPlugs, "each", P.ezPlugPrice);
  // Broan Vents
  const broanVent = VENT_OPTIONS.find(v => v.id === "broan-vent");
  add("bathroom-vents", "Broan Vent", calc.bathroomVents, "each", broanVent?.unitPrice || 30);
  // Caulk
  add("caulk", "Caulk / Sealant", calc.caulkTubes, "tubes", P.caulkPrice);
  // Spray Paint
  add("spray-paint", "Spray Paint", calc.sprayPaintCans, "cans", P.sprayPaintPrice);
  // Decking
  add("decking", "OSB Decking 4x8", calc.deckingSheets, "sheets", P.deckingSheetPrice);
  // Modified Bitumen
  add("mod-bit-base", "Modified Bitumen Base Sheet", calc.modBitBaseRolls, "rolls", P.modBitBasePrice);
  add("mod-bit-cap", "Modified Bitumen Cap Sheet", calc.modBitCapRolls, "rolls", P.modBitCapPrice);

  // Exhaust Ventilation
  if (calc.exhaustVentType && calc.exhaustVentQty > 0) {
    const vent = VENT_OPTIONS.find(v => v.id === calc.exhaustVentType);
    if (vent) {
      add("exhaust-vent", vent.name, calc.exhaustVentQty, vent.unit, vent.unitPrice);
    }
  }

  // Intake Ventilation
  if (calc.intakeVentType && calc.intakeVentQty > 0) {
    const vent = VENT_OPTIONS.find(v => v.id === calc.intakeVentType);
    if (vent) {
      add("intake-vent", vent.name, calc.intakeVentQty, vent.unit, vent.unitPrice);
    }
  }

  return lines;
}// ---- Labor Cost Calculation ----

export interface LaborCostLine {
  id: string;
  name: string;
  qty: number;
  unit: string;
  rate: number;
  total: number;
}

export function calculateLaborCostLines(
  measurements: RoofMeasurements,
  calc: CalculatedMaterials,
  baseLaborRate: number,
  laborOverrides: Record<string, number> // user can override individual rates
): LaborCostLine[] {
  const lines: LaborCostLine[] = [];
  const totalSq = getTotalSquares(measurements);

  const add = (id: string, name: string, qty: number, unit: string, defaultRate: number) => {
    if (qty > 0) {
      const rate = laborOverrides[id] ?? defaultRate;
      lines.push({ id, name, qty, unit, rate, total: qty * rate });
    }
  };

  // Base labor: $80/SQ includes tear off, install shingles, underlayment,
  // ice & water, drip edge, valley metal, pipe jacks, haul off & cleanup
  add("base-labor", "Base Labor (all-inclusive)", totalSq, "per sq", baseLaborRate);

  // Multi-pitch adders (Ryan: each pitch zone gets its own adder)
  add("pitch-89", "Steep Pitch (8-9)", measurements.pitch89Sq, "per sq", 10);
  add("pitch-1011", "Steep Pitch (10-11)", measurements.pitch1011Sq, "per sq", 20);
  add("pitch-12plus", "Steep Pitch (12+)", measurements.pitch12PlusSq, "per sq", 30);
  add("pitch-mansard", "Mansard", measurements.pitchMansardSq, "per sq", 40);

  // Two story: +$10/SQ on ALL squares
  if (measurements.stories >= 2) {
    add("two-story", "Two Story Charge", totalSq, "per sq", 10);
  }

  // Additional layer tear off (Ryan: separate from base labor)
  if (measurements.additionalLayers > 0) {
    add("additional-shingle-tearoff", "Additional Layer Shingle Tear Off", totalSq * measurements.additionalLayers, "per sq", 10);
    add("additional-felt-tearoff", "Additional Layer Felt Tear Off", totalSq * measurements.additionalLayers, "per sq", 5);
  }

  // Cedar shake tearoff
  if (measurements.shakeTearoff) {
    add("cedar-shake-tearoff", "Cedar Shake Tear Off", totalSq, "per sq", 15);
  }

  // Hand load: $5/SQ (Ryan corrected from $10)
  if (measurements.handLoad) {
    add("hand-load", "Hand Load", totalSq, "per sq", 5);
  }

  // Chimney flashing: $120/chimney
  add("chimney-flashing", "Chimney Flashing", measurements.chimneyCount, "each", 120);

  // Build cricket: $100/each (Ryan corrected from $50)
  if (measurements.chimneyCount > 0) {
    add("build-cricket", "Build Cricket", measurements.chimneyCount, "each", 100);
  }

  // Skylight flashing: $120/skylight
  add("skylight-flashing", "Skylight Flashing", measurements.skylightCount, "each", 120);

  // Ridge vent labor (cut in + install)
  if (measurements.exhaustVentType === "omni-ridge-4ft" || measurements.exhaustVentType === "omni-roll-30ft") {
    add("cut-ridge-vent", "Cut in Ridge Vent", measurements.ridgeLf, "per LF", 7);
    add("install-ridge-vent", "Install Ridge Vent", measurements.ridgeLf, "per LF", 2);
  }

  // Turtle/750 vent cut-in
  if (measurements.exhaustVentType === "lomanco-750" || measurements.exhaustVentType === "turbine-vent") {
    add("cut-turtle-vent", "Cut in Turtle Vent", measurements.exhaustVentQty, "each", 10);
  }

  // Decking labor
  if (measurements.deckingAction === "tear-off") {
    add("remove-install-decking", "Remove + Install Decking", calc.deckingSheets, "per sheet", 30);
  } else if (measurements.deckingAction === "overlay") {
    add("install-decking", "Install Decking (over existing)", calc.deckingSheets, "per sheet", 20);
  }

  // Modified bitumen install: $20/SQ extra (total $100/SQ with base labor)
  if (calc.modBitBaseRolls > 0 || calc.modBitCapRolls > 0) {
    const modBitSq = Math.max(calc.modBitBaseRolls * MATERIAL_PRICES.modBitBaseSqPerRoll, calc.modBitCapRolls);
    add("mod-bit-install", "Modified Bitumen Install", modBitSq, "per sq", 20);
  }

  return lines;
}

// ---- Margin Calculations ----

export function calculatePriceForMargin(totalCost: number, targetMarginPct: number): number {
  if (targetMarginPct >= 100) return Infinity;
  return totalCost / (1 - targetMarginPct / 100);
}

export function calculateActualMargin(totalCost: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  return ((sellingPrice - totalCost) / sellingPrice) * 100;
}

// ---- Legacy compatibility exports ----
// These keep old components from breaking during migration

export interface MaterialItem {
  id: string;
  lineNumber: number;
  name: string;
  unit: string;
  unitPrice: number;
  contributeToSquares: boolean;
  contributeToLaborSquares: boolean;
  defaultQty: number;
  category: string;
}

export const MATERIAL_ITEMS: MaterialItem[] = [];
export const LABOR_ITEMS: { id: string; name: string; unit: string; defaultCostPerUnit: number; isBaseLabor: boolean; autoFromSquares: boolean; description: string }[] = [];
export const STEEP_PITCH_TIERS = PITCH_TIERS;
export const DEFAULT_MATERIAL_QTYS: Record<string, number> = {};
export const DEFAULT_LABOR_QTYS: Record<string, number> = {};
export const DEFAULT_LABOR_COSTS: Record<string, number> = {};

export function calculateShingleSquares(_: Record<string, number>): number { return 0; }
export function calculateLaborSquares(_: Record<string, number>): number { return 0; }
export function calculateMaterialCost(_: Record<string, number>): number { return 0; }
export function calculateSteepPitchAdder(_: Record<string, number>): number { return 0; }