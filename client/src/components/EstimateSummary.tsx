import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SUPPLIERS, SHINGLE_TYPES } from "@/lib/data";
import { ClipboardCheck, FileText, Save, RotateCcw } from "lucide-react";
import type { EstimatorState } from "@/hooks/useEstimator";

interface EstimateSummaryProps {
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
  materialItemCount: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalCustomCosts: number;
  estimateTotal: number;
  onReset: () => void;
  onSave: () => void;
  onGeneratePdf: () => void;
}

export default function EstimateSummary(props: EstimateSummaryProps) {
  const supplierName = SUPPLIERS.find((s) => s.id === props.state.supplier)?.name || props.state.supplier;
  const shingleName = SHINGLE_TYPES.find((s) => s.id === props.state.shingleType)?.name || props.state.shingleType;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          Estimate Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Job Info */}
        <div>
          <div className="text-sm font-semibold italic">
            {props.state.jobName || "No job name"}
          </div>
          <div className="text-xs text-muted-foreground">
            {props.state.address || "No address"}
          </div>
        </div>

        <div className="flex gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {supplierName}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
            {shingleName}
          </span>
        </div>

        {/* Numbers */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shingle Squares</span>
            <span className="font-num font-semibold">{props.shingleSquares.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Labor Squares</span>
            <span className="font-num font-semibold">{props.laborSquares.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Materials
            </span>
            <span className="font-num font-semibold">{formatCurrency(props.totalMaterialCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Labor Total
            </span>
            <span className="font-num font-semibold">{formatCurrency(props.totalLaborCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Delivery / Other
            </span>
            <span className="font-num font-semibold">{formatCurrency(props.totalCustomCosts)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Estimate Total</span>
            <span className="text-2xl font-bold font-num text-primary">
              {formatCurrency(props.estimateTotal)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button className="w-full gap-2" onClick={props.onGeneratePdf}>
            <FileText className="w-4 h-4" />
            Generate Estimate PDF
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={props.onSave}>
            <Save className="w-4 h-4" />
            Save Estimate
          </Button>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={props.onReset}>
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
