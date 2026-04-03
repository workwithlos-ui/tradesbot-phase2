import { useState } from "react";
import SectionAccordion from "@/components/SectionAccordion";
import { Slider } from "@/components/ui/slider";
import { MATERIAL_ITEMS, WASTE_FACTOR_MIN, WASTE_FACTOR_MAX, calculateBundlesWithWaste } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";

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

  const wasteLabel = wasteFactor <= 5 ? "Simple" : wasteFactor <= 9 ? "Standard" : "Complex";

  const suggestedBundles = shingleSquares > 0 ? calculateBundlesWithWaste(shingleSquares, wasteFactor) : null;
  const currentBundles = materialQtys["shingle-bundles"] || 0;
  const bundleDiff = suggestedBundles !== null ? suggestedBundles - currentBundles : 0;

  const rightContent = (
    <div className="text-right">
      <div className="text-sm font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(totalMaterialCost)}</div>
      <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{activeCount}/{totalItems} items</div>
    </div>
  );

  return (
    <SectionAccordion
      icon={<Package className="w-4 h-4" />}
      title="Materials"
      subtitle={activeCount > 0 ? `${activeCount} items · ${shingleSquares.toFixed(1)} sq` : "Enter quantities for each material"}
      rightContent={rightContent}
      defaultOpen={true}
    >
      {/* Squares summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="surface-highlight rounded-lg p-3.5 text-center">
          <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Shingle Sq</div>
          <div className="text-2xl font-bold font-num" style={{ color: "var(--primary)" }}>{shingleSquares.toFixed(1)}</div>
          <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>From bundles</div>
        </div>
        <div className="rounded-lg p-3.5 text-center" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Labor Sq</div>
          <div className="text-2xl font-bold font-num" style={{ color: "var(--foreground)" }}>{laborSquares.toFixed(1)}</div>
          <div className="text-[9px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Shingles + starter + ridge</div>
        </div>
      </div>

      {/* Waste Factor */}
      <div className="surface-warn rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Waste Factor</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>{wasteLabel}</span>
          </div>
          <span className="text-lg font-bold font-num" style={{ color: "#FBBF24" }}>{wasteFactor}%</span>
        </div>
        <Slider
          min={WASTE_FACTOR_MIN}
          max={WASTE_FACTOR_MAX}
          step={1}
          value={[wasteFactor]}
          onValueChange={(vals) => onWasteFactorChange(vals[0])}
          className="mb-2"
        />
        <div className="flex justify-between text-[9px]" style={{ color: "var(--muted-foreground)" }}>
          <span>{WASTE_FACTOR_MIN}% simple</span>
          <span>8% standard</span>
          <span>{WASTE_FACTOR_MAX}% complex</span>
        </div>
        {suggestedBundles !== null && shingleSquares > 0 && (
          <div className="mt-3 pt-3 text-[11px]" style={{ borderTop: "1px solid rgba(251,191,36,0.12)" }}>
            <span style={{ color: "#FBBF24" }}>
              Suggested: <span className="font-bold">{suggestedBundles} bundles</span>
            </span>
            {bundleDiff > 0 && <span className="ml-2" style={{ color: "#EF4444" }}>({currentBundles} entered — {bundleDiff} short)</span>}
            {bundleDiff < 0 && <span className="ml-2" style={{ color: "#22C55E" }}>({currentBundles} entered — {Math.abs(bundleDiff)} over)</span>}
            {bundleDiff === 0 && currentBundles > 0 && <span className="ml-2" style={{ color: "#22C55E" }}>On target</span>}
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
          <div key={cat} className="mb-2 last:mb-0">
            <button
              type="button"
              onClick={() => setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))}
              className="w-full flex items-center justify-between py-2.5 text-left group"
            >
              <div className="flex items-center gap-2">
                <ChevronRight
                  className="w-3 h-3 transition-transform duration-150"
                  style={{ color: "var(--muted-foreground)", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  {CATEGORY_LABELS[cat] || cat}
                </span>
                {catActive > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ background: "rgba(0,212,170,0.1)", color: "var(--primary)" }}>
                    {catActive}
                  </span>
                )}
              </div>
              {catTotal > 0 && (
                <span className="text-[11px] font-num font-medium" style={{ color: "var(--primary)" }}>{formatCurrency(catTotal)}</span>
              )}
            </button>

            {isOpen && (
              <div className="space-y-0 pb-2">
                {items.map((item) => {
                  const qty = materialQtys[item.id] || 0;
                  const lineTotal = qty * item.unitPrice;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 py-2"
                      style={{ borderBottom: "1px solid rgba(42,42,42,0.5)" }}
                    >
                      <span className="text-[9px] font-num w-4 text-right shrink-0" style={{ color: "rgba(120,113,108,0.4)" }}>
                        {item.lineNumber}
                      </span>
                      <span className="text-[13px] flex-1 min-w-0 leading-tight" style={{ color: "var(--foreground)" }} title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[9px] shrink-0 w-10 text-right" style={{ color: "var(--muted-foreground)" }}>
                        {item.unit}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={qty || ""}
                        onChange={(e) => onMaterialQtyChange(item.id, parseInt(e.target.value) || 0)}
                        className="num-input"
                        style={{ width: "60px", minHeight: "40px" }}
                      />
                      <span className="text-[11px] font-num w-14 text-right shrink-0" style={{ color: qty > 0 ? "var(--foreground)" : "transparent" }}>
                        {formatCurrency(lineTotal)}
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
      <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Material Total</span>
        <span className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(totalMaterialCost)}</span>
      </div>
    </SectionAccordion>
  );
}
