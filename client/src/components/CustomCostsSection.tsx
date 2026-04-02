import SectionAccordion from "@/components/SectionAccordion";
import { formatCurrency } from "@/lib/utils";
import { TARP_SYSTEM_CHARGE } from "@/lib/data";
import type { AdditionalCostItem } from "@/lib/data";
import { DollarSign, Truck, Plus, Trash2 } from "lucide-react";

interface CustomCostsSectionProps {
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

export default function CustomCostsSection(props: CustomCostsSectionProps) {
  const customItemsTotal = props.additionalCosts.reduce((sum, item) => sum + item.amount, 0);
  const deliveryTotal = props.deliveryEnabled ? props.deliveryCost : 0;
  const itemCount = props.additionalCosts.length + (props.deliveryEnabled ? 1 : 0);

  const rightContent = (
    <div className="text-right">
      <div className="text-sm font-bold font-num text-primary">{formatCurrency(props.totalCustomCosts)}</div>
      <div className="text-xs text-muted-foreground">
        Tarp + {itemCount} item{itemCount !== 1 ? "s" : ""}
      </div>
    </div>
  );

  return (
    <SectionAccordion
      icon={<DollarSign className="w-4 h-4" />}
      title="Additional Costs"
      subtitle="Tarp charge, delivery, and custom items"
      rightContent={rightContent}
      defaultOpen={false}
    >
      <div className="space-y-4">
        {/* Fixed: Tarp System Charge */}
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl">
          <div>
            <div className="text-sm font-semibold">Tarp System Charge</div>
            <div className="text-xs text-muted-foreground mt-0.5">Fixed $50 per job — every estimate</div>
          </div>
          <span className="text-sm font-bold font-num">{formatCurrency(TARP_SYSTEM_CHARGE)}</span>
        </div>

        {/* Delivery Toggle */}
        <div className="border border-border/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => props.onDeliveryChange(!props.deliveryEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 ${
                  props.deliveryEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    props.deliveryEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Material Delivery</span>
              </div>
            </div>
            {props.deliveryEnabled && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.deliveryCost}
                  onChange={(e) => props.onDeliveryCostChange(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 text-sm text-right border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 font-num"
                  style={{ minHeight: "40px" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Custom Line Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom Items</p>
              <p className="text-xs text-muted-foreground mt-0.5">Cupola, framing, vents, etc.</p>
            </div>
            <button
              type="button"
              onClick={props.onAddAdditionalCost}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          {props.additionalCosts.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border/60 rounded-xl">
              <p className="text-xs text-muted-foreground">No custom items yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {props.additionalCosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 border border-border/60 rounded-xl bg-background"
                >
                  <input
                    type="text"
                    placeholder="e.g. Custom cupola repair"
                    value={item.description}
                    onChange={(e) => props.onUpdateAdditionalCost(item.id, "description", e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/50 transition-colors"
                    style={{ minHeight: "40px" }}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={item.amount || ""}
                      onChange={(e) =>
                        props.onUpdateAdditionalCost(item.id, "amount", parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-3 py-2 text-sm text-right border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 font-num transition-colors"
                      style={{ minHeight: "40px" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => props.onRemoveAdditionalCost(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Total */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm font-semibold">Additional Costs Total</span>
          <span className="text-lg font-bold font-num text-primary">{formatCurrency(props.totalCustomCosts)}</span>
        </div>
      </div>
    </SectionAccordion>
  );
}
