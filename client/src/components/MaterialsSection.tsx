import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MATERIAL_ITEMS, WASTE_FACTOR_MIN, WASTE_FACTOR_MAX, calculateBundlesWithWaste } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Package, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface MaterialsSectionProps {
  materialQtys: Record<string, number>;
  onMaterialQtyChange: (id: string, qty: number) => void;
  shingleSquares: number;
  laborSquares: number;
  totalMaterialCost: number;
  wasteFactor: number;
  onWasteFactorChange: (value: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  bundles: "Shingle Bundles (count toward squares)",
  underlayment: "Underlayment and Shields",
  flashing: "Flashing, Edge, and Metal",
  ventilation: "Ventilation",
  fasteners: "Fasteners",
  decking: "Decking",
  other: "Other Materials",
};

const CATEGORY_ORDER = ["bundles", "underlayment", "flashing", "ventilation", "fasteners", "decking", "other"];

export default function MaterialsSection({
  materialQtys,
  onMaterialQtyChange,
  shingleSquares,
  laborSquares,
  totalMaterialCost,
  wasteFactor,
  onWasteFactorChange,
}: MaterialsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeCount = Object.values(materialQtys).filter((v) => v > 0).length;
  const totalItems = MATERIAL_ITEMS.length;

  // Group materials by category
  const grouped: Record<string, typeof MATERIAL_ITEMS> = {};
  for (const item of MATERIAL_ITEMS) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  // Waste factor guidance
  const wasteLabel = wasteFactor <= 5 ? "Simple roof (low waste)" : wasteFactor <= 9 ? "Standard roof" : "Complex / cut-up roof";
  const wasteColor = wasteFactor <= 5 ? "text-green-600" : wasteFactor <= 9 ? "text-amber-600" : "text-red-600";

  // Suggested bundles with waste (based on current shingle squares)
  const suggestedBundles = shingleSquares > 0 ? calculateBundlesWithWaste(shingleSquares, wasteFactor) : null;
  const currentBundles = materialQtys["shingle-bundles"] || 0;
  const bundleShortfall = suggestedBundles !== null ? suggestedBundles - currentBundles : 0;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Materials
            <span className="text-xs font-normal text-muted-foreground">
              ({activeCount} of {totalItems} items)
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-num text-primary">
              {formatCurrency(totalMaterialCost)}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {/* Waste Factor (Ryan Part 2) */}
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold">Waste Factor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${wasteColor}`}>{wasteLabel}</span>
                <span className="text-lg font-bold font-num text-amber-700">{wasteFactor}%</span>
              </div>
            </div>
            <Slider
              min={WASTE_FACTOR_MIN}
              max={WASTE_FACTOR_MAX}
              step={1}
              value={[wasteFactor]}
              onValueChange={(vals) => onWasteFactorChange(vals[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
              <span>{WASTE_FACTOR_MIN}% (simple)</span>
              <span>8% (standard)</span>
              <span>{WASTE_FACTOR_MAX}% (complex)</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Waste factor adds extra bundles to account for cuts and overages. Simple roofs: 4-6%. Standard: 8%. Complex/cut-up roofs: 10-12%+.
            </p>
            {shingleSquares > 0 && suggestedBundles !== null && (
              <div className="mt-2 pt-2 border-t border-amber-200">
                <p className="text-xs font-medium text-amber-800">
                  Suggested shingle bundles with {wasteFactor}% waste: <span className="font-bold">{suggestedBundles} bundles</span>
                  {" "}({shingleSquares.toFixed(1)} sq × {(1 + wasteFactor/100).toFixed(2)} = {(shingleSquares * (1 + wasteFactor/100)).toFixed(2)} sq → {suggestedBundles} bundles)
                </p>
                {bundleShortfall > 0 && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    ⚠ Currently {currentBundles} bundles entered — {bundleShortfall} short of suggested amount
                  </p>
                )}
                {bundleShortfall < 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✓ Currently {currentBundles} bundles entered — {Math.abs(bundleShortfall)} over suggested amount
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Material line items by category */}
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat} className="mb-4 last:mb-0">
                <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[cat] || cat}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {items.map((item) => {
                    const qty = materialQtys[item.id] || 0;
                    const lineTotal = qty * item.unitPrice;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 py-1 border-b border-border/30 last:border-b-0"
                      >
                        <span className="text-[10px] font-num text-muted-foreground w-5 text-right shrink-0">
                          {item.lineNumber}
                        </span>
                        <span className="text-sm flex-1 min-w-0 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 w-12 text-right">
                          {item.unit}
                        </span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={qty || ""}
                          onChange={(e) => onMaterialQtyChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-14 px-1.5 py-1 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                        />
                        <span className="text-xs font-num text-muted-foreground w-16 text-right shrink-0">
                          {qty > 0 ? formatCurrency(lineTotal) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Total Squares — auto-populated from materials input */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Shingle Squares</div>
                <div className="text-2xl font-bold font-num text-primary">{shingleSquares.toFixed(1)}</div>
                <div className="text-[10px] text-muted-foreground">From shingle bundles only</div>
              </div>
              <div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Labor Squares</div>
                <div className="text-2xl font-bold font-num text-primary">{laborSquares.toFixed(1)}</div>
                <div className="text-[10px] text-muted-foreground">Shingles + starter + ridge</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Every 3 bundles = 1 square. Labor squares include starter, ridge cap, and high-profile ridge bundles.
            </p>
          </div>

          {/* Material Total */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Material Total</span>
            <span className="text-lg font-bold font-num text-primary">
              {formatCurrency(totalMaterialCost)}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
