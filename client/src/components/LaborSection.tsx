import SectionAccordion from "@/components/SectionAccordion";
import type { LaborCostLine } from "@/lib/data";
import { Wrench } from "lucide-react";

interface Props {
  laborCostLines: LaborCostLine[];
  totalLaborCost: number;
  totalSquares: number;
  laborOverrides: Record<string, number>;
  onLaborOverride: (id: string, rate: number) => void;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LaborSection({ laborCostLines, totalLaborCost, totalSquares, laborOverrides, onLaborOverride }: Props) {
  const activeLines = laborCostLines.filter(l => l.qty > 0);

  const subtitle = activeLines.length > 0
    ? `${activeLines.length} items / $${fmt(totalLaborCost)}`
    : "Auto-calculated from measurements";

  return (
    <SectionAccordion
      icon={<Wrench className="w-4 h-4" />}
      title="Labor"
      subtitle={subtitle}
      defaultOpen={true}
      badge={totalLaborCost > 0 ? `$${fmt(totalLaborCost)}` : undefined}
    >
      <div className="space-y-3">
        {activeLines.length === 0 ? (
          <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Enter roof measurements to auto-calculate labor</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              <div className="col-span-4">Item</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-3 text-right">Rate</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Lines */}
            {activeLines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 rounded-lg transition-colors"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <div className="col-span-4">
                  <span className="text-[13px] font-medium leading-tight" style={{ color: "var(--foreground)" }}>{line.name}</span>
                  <span className="block text-[10px]" style={{ color: "var(--muted-foreground)" }}>{line.unit}</span>
                </div>
                <div className="col-span-2 text-right font-num text-sm" style={{ color: "var(--foreground)" }}>
                  {line.qty}
                </div>
                <div className="col-span-3 text-right">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={laborOverrides[line.id] ?? line.rate}
                    onChange={(e) => onLaborOverride(line.id, parseFloat(e.target.value) || 0)}
                    className="num-input"
                    style={{ width: "80px", minHeight: "36px", fontSize: "13px", display: "inline-block" }}
                  />
                </div>
                <div className="col-span-3 text-right font-num text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  ${fmt(line.total)}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="pt-3 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Total Labor</span>
                <span className="font-num text-lg font-bold" style={{ color: "var(--primary)" }}>${fmt(totalLaborCost)}</span>
              </div>
              {totalSquares > 0 && (
                <div className="text-[11px] text-right mt-1" style={{ color: "var(--muted-foreground)" }}>
                  ${fmt(totalLaborCost / totalSquares)}/sq
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SectionAccordion>
  );
}
