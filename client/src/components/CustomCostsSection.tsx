import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TARP_SYSTEM_CHARGE } from "@/lib/data";
import type { AdditionalCostItem } from "@/lib/data";
import { DollarSign, Truck, Plus, Trash2, Shield } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Additional Costs
          <span className="text-xs font-normal text-muted-foreground">
            (Fixed charges, delivery, custom items)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fixed: Tarp System Charge — $50 per job, every estimate */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-sm font-medium">Tarp System Charge</span>
                <p className="text-[10px] text-muted-foreground">Fixed $50/job — crews keep, house, and set up tarp system</p>
              </div>
            </div>
            <span className="text-sm font-bold font-num">{formatCurrency(TARP_SYSTEM_CHARGE)}</span>
          </div>
        </div>

        {/* Delivery Toggle */}
        <div className="border border-border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => props.onDeliveryChange(!props.deliveryEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  props.deliveryEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    props.deliveryEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Material Delivery</span>
              </div>
            </div>
            {props.deliveryEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.deliveryCost}
                  onChange={(e) => props.onDeliveryCostChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                />
              </div>
            )}
          </div>
          {props.deliveryEnabled && (
            <p className="text-xs text-muted-foreground mt-2 ml-14">
              Delivery charge: {formatCurrency(props.deliveryCost)}
            </p>
          )}
        </div>

        {/* Free-Form Additional Cost Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Custom / Non-Standard Items
            </h4>
            <button
              onClick={props.onAddAdditionalCost}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Add custom items not in standard pricing (e.g., custom cupola, extra framing, bathroom vents, etc.)
          </p>

          {props.additionalCosts.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-border rounded-lg">
              <p className="text-xs text-muted-foreground">No custom items added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-[1fr_100px_32px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span>Description</span>
                <span className="text-right">Amount</span>
                <span></span>
              </div>
              {props.additionalCosts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_100px_32px] gap-2 items-center py-1.5 border-b border-border/30 last:border-b-0"
                >
                  <input
                    type="text"
                    placeholder="e.g. Custom cupola repair"
                    value={item.description}
                    onChange={(e) => props.onUpdateAdditionalCost(item.id, "description", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={item.amount || ""}
                      onChange={(e) => props.onUpdateAdditionalCost(item.id, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                    />
                  </div>
                  <button
                    onClick={() => props.onRemoveAdditionalCost(item.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Total */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm font-semibold">Additional Costs Total</span>
          <span className="text-lg font-bold font-num text-primary">
            {formatCurrency(props.totalCustomCosts)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
