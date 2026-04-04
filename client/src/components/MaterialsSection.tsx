import SectionAccordion from "@/components/SectionAccordion";
import type { MaterialCostLine } from "@/lib/data";
import { Package } from "lucide-react";

interface Props {
  materialCostLines: MaterialCostLine[];
  totalMaterialCost: number;
  totalSquares: number;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MaterialsSection({ materialCostLines, totalMaterialCost, totalSquares }: Props) {
  const activeLines = materialCostLines.filter(l => l.qty > 0);

  const subtitle = activeLines.length > 0
    ? `${activeLines.length} items / $${fmt(totalMaterialCost)}`
    : "Auto-calculated from measurements";

  return (
    <SectionAccordion
      icon={<Package className="w-4 h-4" />}
      title="Materials"
      subtitle={subtitle}
      defaultOpen={true}
      badge={totalMaterialCost > 0 ? `$${fmt(totalMaterialCost)}` : undefined}
    >
      <div className="space-y-3">
        {activeLines.length === 0 ? (
          <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Enter roof measurements above to auto-calculate materials</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit $</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Lines */}
            {activeLines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 rounded-lg transition-colors"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <div className="col-span-5">
                  <span className="text-[13px] font-medium leading-tight" style={{ color: "var(--foreground)" }}>{line.name}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-num text-sm" style={{ color: "var(--foreground)" }}>{line.qty}</span>
                  <span className="text-[9px] ml-0.5" style={{ color: "var(--muted-foreground)" }}>{line.unit}</span>
                </div>
                <div className="col-span-2 text-right font-num text-sm" style={{ color: "var(--muted-foreground)" }}>
                  ${fmt(line.unitPrice)}
                </div>
                <div className="col-span-3 text-right font-num text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  ${fmt(line.total)}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="pt-3 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Total Materials</span>
                <span className="font-num text-lg font-bold" style={{ color: "var(--primary)" }}>${fmt(totalMaterialCost)}</span>
              </div>
              {totalSquares > 0 && (
                <div className="text-[11px] text-right mt-1" style={{ color: "var(--muted-foreground)" }}>
                  ${fmt(totalMaterialCost / totalSquares)}/sq
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SectionAccordion>
  );
}
