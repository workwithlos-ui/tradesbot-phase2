import SectionAccordion from "@/components/SectionAccordion";
import { TARP_SYSTEM_CHARGE } from "@/lib/data";
import type { AdditionalCostItem } from "@/lib/data";
import { DollarSign, Truck, Plus, Trash2 } from "lucide-react";

interface Props {
  deliveryEnabled: boolean;
  deliveryCost: number;
  onDeliveryChange: (enabled: boolean) => void;
  onDeliveryCostChange: (cost: number) => void;
  additionalCosts: AdditionalCostItem[];
  onAddAdditionalCost: () => void;
  onUpdateAdditionalCost: (id: string, field: "description" | "amount", value: string | number) => void;
  onRemoveAdditionalCost: (id: string) => void;
  tarpCharge: number;
  totalCustomCosts: number;
}

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CustomCostsSection(props: Props) {
  const itemCount = props.additionalCosts.length + (props.deliveryEnabled ? 1 : 0);

  return (
    <SectionAccordion
      icon={<DollarSign className="w-4 h-4" />}
      title="Additional Costs"
      subtitle="Tarp, delivery, and custom items"
      defaultOpen={false}
      badge={fmt(props.totalCustomCosts)}
    >
      <div className="space-y-4">
        {/* Fixed: Tarp System Charge */}
        <div className="surface-warn rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Tarp System Charge</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Fixed $50 per job</div>
          </div>
          <span className="text-sm font-bold font-num" style={{ color: "#FBBF24" }}>{fmt(TARP_SYSTEM_CHARGE)}</span>
        </div>

        {/* Delivery Toggle */}
        <div className="rounded-lg p-3.5" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => props.onDeliveryChange(!props.deliveryEnabled)}
                className="toggle-track shrink-0"
                style={{ background: props.deliveryEnabled ? "var(--primary)" : "var(--muted)" }}
              >
                <span
                  className="toggle-thumb"
                  style={{ transform: props.deliveryEnabled ? "translateX(22px)" : "translateX(4px)" }}
                />
              </button>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Material Delivery</span>
              </div>
            </div>
            {props.deliveryEnabled && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.deliveryCost}
                  onChange={(e) => props.onDeliveryCostChange(parseFloat(e.target.value) || 0)}
                  className="num-input"
                  style={{ width: "96px" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Custom Line Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Custom Items</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Cupola, framing, vents, etc.</p>
            </div>
            <button
              type="button"
              onClick={props.onAddAdditionalCost}
              className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium rounded-lg transition-all"
              style={{ color: "var(--primary)", border: "1px solid rgba(0,212,170,0.25)", background: "rgba(0,212,170,0.05)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          {props.additionalCosts.length === 0 ? (
            <div className="text-center py-6 rounded-lg" style={{ border: "1px dashed var(--border)" }}>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>No custom items yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {props.additionalCosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <input
                    type="text"
                    placeholder="e.g. Custom cupola repair"
                    value={item.description}
                    onChange={(e) => props.onUpdateAdditionalCost(item.id, "description", e.target.value)}
                    className="field-input flex-1"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={item.amount || ""}
                      onChange={(e) => props.onUpdateAdditionalCost(item.id, "amount", parseFloat(e.target.value) || 0)}
                      className="num-input"
                      style={{ width: "96px" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => props.onRemoveAdditionalCost(item.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Total */}
        <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Additional Costs Total</span>
          <span className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>{fmt(props.totalCustomCosts)}</span>
        </div>
      </div>
    </SectionAccordion>
  );
}
