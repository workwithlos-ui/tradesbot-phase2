import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Truck } from "lucide-react";

interface CustomCostsSectionProps {
  deliveryEnabled: boolean;
  deliveryCost: number;
  onDeliveryChange: (enabled: boolean) => void;
  onDeliveryCostChange: (cost: number) => void;
  customCosts: Record<string, number>;
  customCostEnabled: Record<string, boolean>;
  onCustomCostChange: (id: string, amount: number) => void;
  onToggleCustomCost: (id: string) => void;
}

export default function CustomCostsSection(props: CustomCostsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          Delivery
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <span className="text-sm">Material Delivery</span>
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
          <p className="text-xs text-muted-foreground mt-2">
            Delivery charge: {formatCurrency(props.deliveryCost)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
