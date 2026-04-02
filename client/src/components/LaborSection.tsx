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
      <div className="text-sm font-bold font-num text-primary">{formatCurrency(props.totalLaborCost)}</div>
      <div className="text-xs text-muted-foreground">
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
          ? `${props.laborSquares.toFixed(1)} labor sq × $${baseRate}/sq = ${formatCurrency(props.baseLaborCost)}`
          : "Fill in materials first to auto-populate labor squares"
      }
      rightContent={rightContent}
      defaultOpen={true}
    >
      {/* Base Labor */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Base Labor</p>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="text-sm font-semibold">Base Labor Rate</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {props.laborSquares.toFixed(1)} sq × ${baseRate}/sq
              </div>
            </div>
            <div className="text-lg font-bold font-num text-primary shrink-0">
              {formatCurrency(props.baseLaborCost)}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            Tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off & clean up
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground shrink-0">$/sq:</label>
            <input
              type="number"
              min="0"
              step="1"
              value={baseRate}
              onChange={(e) => props.onLaborCostChange("base-labor", parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 font-num transition-colors"
              style={{ minHeight: "40px" }}
            />
          </div>
        </div>
      </div>

      {/* Steep Pitch Adder */}
      {props.steepPitchAdder > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Steep Pitch Adder</p>
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Steep Pitch Surcharge</span>
              <span className="text-sm font-bold font-num">{formatCurrency(props.steepPitchAdder)}</span>
            </div>
            <div className="space-y-1">
              {STEEP_PITCH_TIERS.map((tier) => {
                const sq = props.steepPitchSquares[tier.id] || 0;
                if (sq <= 0) return null;
                return (
                  <div key={tier.id} className="text-xs text-muted-foreground flex justify-between">
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
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Additional Items</p>
        <p className="text-xs text-muted-foreground mb-3">Enter quantity and rate for each applicable item.</p>

        <div className="space-y-2">
          {nonBaseItems.map((item) => {
            const qty = props.laborQtys[item.id] || 0;
            const cost = props.laborCosts[item.id] || item.defaultCostPerUnit;
            const lineTotal = qty * cost;
            const isActive = qty > 0;

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-colors ${
                  isActive ? "border-primary/20 bg-primary/3" : "border-border/60 bg-background"
                }`}
              >
                {/* Mobile: stacked layout */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && (
                      <span className="text-sm font-bold font-num text-primary">{formatCurrency(lineTotal)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">Qty ({item.unit})</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={qty || ""}
                        onChange={(e) => props.onLaborQtyChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm text-right border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 font-num transition-colors mt-0.5"
                        style={{ minHeight: "40px" }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground">$/unit</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={cost || ""}
                        onChange={(e) => props.onLaborCostChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm text-right border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 font-num transition-colors mt-0.5"
                        style={{ minHeight: "40px" }}
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
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Labor Total</span>
        <span className="text-lg font-bold font-num text-primary">{formatCurrency(props.totalLaborCost)}</span>
      </div>
    </SectionAccordion>
  );
}
