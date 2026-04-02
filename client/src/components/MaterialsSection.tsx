import { useState } from "react";
import SectionAccordion from "@/components/SectionAccordion";
import { Slider } from "@/components/ui/slider";
import { MATERIAL_ITEMS, WASTE_FACTOR_MIN, WASTE_FACTOR_MAX, calculateBundlesWithWaste } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Package } from "lucide-react";

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
  bundles: "Shingle Bundles",
  underlayment: "Underlayment & Shields",
  flashing: "Flashing, Edge & Metal",
  ventilation: "Ventilation",
  fasteners: "Fasteners",
  decking: "Decking",
  other: "Other",
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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    bundles: true,
    underlayment: true,
    flashing: false,
    ventilation: false,
    fasteners: false,
    decking: false,
    other: false,
  });

  const activeCount = Object.values(materialQtys).filter((v) => v > 0).length;
  const totalItems = MATERIAL_ITEMS.length;

  const grouped: Record<string, typeof MATERIAL_ITEMS> = {};
  for (const item of MATERIAL_ITEMS) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const wasteLabel =
    wasteFactor <= 5 ? "Simple roof" : wasteFactor <= 9 ? "Standard" : "Complex / cut-up";
  const wasteColor =
    wasteFactor <= 5 ? "text-emerald-600" : wasteFactor <= 9 ? "text-amber-600" : "text-red-500";

  const suggestedBundles =
    shingleSquares > 0 ? calculateBundlesWithWaste(shingleSquares, wasteFactor) : null;
  const currentBundles = materialQtys["shingle-bundles"] || 0;
  const bundleDiff = suggestedBundles !== null ? suggestedBundles - currentBundles : 0;

  const rightContent = (
    <div className="text-right">
      <div className="text-sm font-bold font-num text-primary">{formatCurrency(totalMaterialCost)}</div>
      <div className="text-xs text-muted-foreground">{activeCount}/{totalItems} items</div>
    </div>
  );

  return (
    <SectionAccordion
      icon={<Package className="w-4 h-4" />}
      title="Materials"
      subtitle={activeCount > 0 ? `${activeCount} items · ${shingleSquares.toFixed(1)} sq shingles, ${laborSquares.toFixed(1)} sq labor` : "Enter quantities for each material"}
      rightContent={rightContent}
      defaultOpen={true}
    >
      {/* Squares summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5 text-center">
          <div className="text-xs font-medium text-muted-foreground mb-1">Shingle Squares</div>
          <div className="text-2xl font-bold font-num text-primary">{shingleSquares.toFixed(1)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">From shingle bundles</div>
        </div>
        <div className="bg-secondary border border-border/60 rounded-xl p-3.5 text-center">
          <div className="text-xs font-medium text-muted-foreground mb-1">Labor Squares</div>
          <div className="text-2xl font-bold font-num">{laborSquares.toFixed(1)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Shingles + starter + ridge</div>
        </div>
      </div>

      {/* Waste Factor */}
      <div className="mb-5 bg-amber-50 border border-amber-200/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold">Waste Factor</span>
            <span className={`text-xs ml-2 font-medium ${wasteColor}`}>{wasteLabel}</span>
          </div>
          <span className="text-xl font-bold font-num text-amber-700">{wasteFactor}%</span>
        </div>
        <Slider
          min={WASTE_FACTOR_MIN}
          max={WASTE_FACTOR_MAX}
          step={1}
          value={[wasteFactor]}
          onValueChange={(vals) => onWasteFactorChange(vals[0])}
          className="mb-2"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{WASTE_FACTOR_MIN}% simple</span>
          <span>8% standard</span>
          <span>{WASTE_FACTOR_MAX}% complex</span>
        </div>
        {suggestedBundles !== null && shingleSquares > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs">
            <span className="text-amber-800 font-medium">
              Suggested: <span className="font-bold">{suggestedBundles} bundles</span>
            </span>
            {bundleDiff > 0 && (
              <span className="text-red-600 font-medium ml-2">
                ({currentBundles} entered — {bundleDiff} short)
              </span>
            )}
            {bundleDiff < 0 && (
              <span className="text-emerald-600 font-medium ml-2">
                ({currentBundles} entered — {Math.abs(bundleDiff)} over)
              </span>
            )}
            {bundleDiff === 0 && currentBundles > 0 && (
              <span className="text-emerald-600 font-medium ml-2">✓ On target</span>
            )}
          </div>
        )}
      </div>

      {/* Material categories */}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const catTotal = items.reduce((sum, item) => sum + (materialQtys[item.id] || 0) * item.unitPrice, 0);
        const catActive = items.filter((item) => (materialQtys[item.id] || 0) > 0).length;
        const isOpen = openCategories[cat] ?? false;

        return (
          <div key={cat} className="mb-3 last:mb-0">
            <button
              type="button"
              onClick={() => setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))}
              className="w-full flex items-center justify-between py-2 text-left group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {CATEGORY_LABELS[cat] || cat}
                </span>
                {catActive > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary">
                    {catActive}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {catTotal > 0 && (
                  <span className="text-xs font-num font-medium text-primary">{formatCurrency(catTotal)}</span>
                )}
                <span className={`text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="space-y-1 pb-2">
                {items.map((item) => {
                  const qty = materialQtys[item.id] || 0;
                  const lineTotal = qty * item.unitPrice;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 py-2 border-b border-border/40 last:border-0"
                    >
                      <span className="text-[10px] font-num text-muted-foreground/60 w-5 text-right shrink-0">
                        {item.lineNumber}
                      </span>
                      <span className="text-sm flex-1 min-w-0 leading-tight" title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 w-10 text-right">
                        {item.unit}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={qty || ""}
                        onChange={(e) =>
                          onMaterialQtyChange(item.id, parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-2 text-sm text-right border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 font-num transition-colors"
                        style={{ minHeight: "40px" }}
                      />
                      <span className="text-xs font-num text-muted-foreground w-14 text-right shrink-0">
                        {qty > 0 ? formatCurrency(lineTotal) : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Material Total */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Material Total</span>
        <span className="text-lg font-bold font-num text-primary">{formatCurrency(totalMaterialCost)}</span>
      </div>
    </SectionAccordion>
  );
}
