import SectionAccordion from "@/components/SectionAccordion";
import { LABOR_ITEMS, STEEP_PITCH_TIERS, BASE_LABOR_RATE } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Wrench } from "lucide-react";

interface LaborSectionProps {
  laborSquares: number;
  laborQtys: Record<string, number>;
  laborCosts: Record<string, number>;
  steepPitchSquares: Record<string, number>;
  baseLaborCost: number;
  steepPitchAdder: number;
  additionalLaborCost: number;
  totalLaborCost: number;
  onLaborQtyChange: (id: string, qty: number) => void;
  onLaborCostChange: (id: string, cost: number) => void;
}

export default function LaborSection(props: LaborSectionProps) {
  const nonBaseItems = LABOR_ITEMS.filter((item) => !item.isBaseLabor);
  const activeCount = nonBaseItems.filter((item) => (props.laborQtys[item.id] || 0) > 0).length;
  const baseRate = props.laborCosts["base-labor"] || BASE_LABOR_RATE;

  const rightContent = (
    <div className="text-right">
      <div className="text-sm font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(props.totalLaborCost)}</div>
      <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
        {props.laborSquares > 0 ? `${props.laborSquares.toFixed(1)} sq` : "0 sq"}
        {activeCount > 0 ? ` · ${activeCount} extras` : ""}
      </div>
    </div>
  );

  return (
    <SectionAccordion
      icon={<Wrench className="w-4 h-4" />}
      title="Labor"
      subtitle={
        props.laborSquares > 0
          ? `${props.laborSquares.toFixed(1)} sq × $${baseRate}/sq = ${formatCurrency(props.baseLaborCost)}`
          : "Fill in materials first"
      }
      rightContent={rightContent}
      defaultOpen={true}
    >
      {/* Base Labor */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--muted-foreground)" }}>Base Labor</p>
        <div className="surface-highlight rounded-lg p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Base Labor Rate</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {props.laborSquares.toFixed(1)} sq × ${baseRate}/sq
              </div>
            </div>
            <div className="text-lg font-bold font-num shrink-0" style={{ color: "var(--primary)" }}>
              {formatCurrency(props.baseLaborCost)}
            </div>
          </div>
          <p className="text-[10px] leading-relaxed mb-3" style={{ color: "var(--muted-foreground)" }}>
            Tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off & clean up
          </p>
          <div className="flex items-center gap-2">
            <label className="text-[10px] shrink-0" style={{ color: "var(--muted-foreground)" }}>$/sq:</label>
            <input
              type="number"
              min="0"
              step="1"
              value={baseRate}
              onChange={(e) => props.onLaborCostChange("base-labor", parseFloat(e.target.value) || 0)}
              className="num-input"
              style={{ width: "96px" }}
            />
          </div>
        </div>
      </div>

      {/* Steep Pitch Adder */}
      {props.steepPitchAdder > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--muted-foreground)" }}>Steep Pitch Adder</p>
          <div className="surface-warn rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Steep Pitch Surcharge</span>
              <span className="text-sm font-bold font-num" style={{ color: "#FBBF24" }}>{formatCurrency(props.steepPitchAdder)}</span>
            </div>
            <div className="space-y-1">
              {STEEP_PITCH_TIERS.map((tier) => {
                const sq = props.steepPitchSquares[tier.id] || 0;
                if (sq <= 0) return null;
                return (
                  <div key={tier.id} className="text-[11px] flex justify-between" style={{ color: "var(--muted-foreground)" }}>
                    <span>{tier.label}: {sq} sq × ${tier.adderPerSquare}/sq</span>
                    <span className="font-num font-medium">{formatCurrency(sq * tier.adderPerSquare)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Additional Labor Items */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--muted-foreground)" }}>Additional Items</p>
        <p className="text-[11px] mb-3" style={{ color: "var(--muted-foreground)" }}>Enter quantity and rate for each applicable item.</p>

        <div className="space-y-2">
          {nonBaseItems.map((item) => {
            const qty = props.laborQtys[item.id] || 0;
            const cost = props.laborCosts[item.id] || item.defaultCostPerUnit;
            const lineTotal = qty * cost;
            const isActive = qty > 0;

            return (
              <div
                key={item.id}
                className="rounded-lg transition-all"
                style={{
                  background: isActive ? "rgba(0,212,170,0.04)" : "var(--background)",
                  border: isActive ? "1px solid rgba(0,212,170,0.15)" : "1px solid var(--border)",
                }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{item.name}</span>
                    {isActive && (
                      <span className="text-[13px] font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(lineTotal)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Qty ({item.unit})</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={qty || ""}
                        onChange={(e) => props.onLaborQtyChange(item.id, parseFloat(e.target.value) || 0)}
                        className="num-input mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>$/unit</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={cost || ""}
                        onChange={(e) => props.onLaborCostChange(item.id, parseFloat(e.target.value) || 0)}
                        className="num-input mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labor Total */}
      <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Labor Total</span>
        <span className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(props.totalLaborCost)}</span>
      </div>
    </SectionAccordion>
  );
}
