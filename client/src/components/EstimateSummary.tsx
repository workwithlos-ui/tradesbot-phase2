import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { FileText, Save, RotateCcw, TrendingUp, ChevronDown, Package, Wrench } from "lucide-react";
import MaterialOrderModal from "@/components/MaterialOrderModal";
import WorkOrderModal from "@/components/WorkOrderModal";
import { SUPPLIERS, SHINGLE_TYPES, TARP_SYSTEM_CHARGE } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";

interface EstimateSummaryProps {
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
  materialItemCount: number;
  totalMaterialCost: number;
  baseLaborCost: number;
  additionalLaborCost: number;
  steepPitchAdder: number;
  totalLaborCost: number;
  tarpCharge: number;
  totalCustomCosts: number;
  estimateTotal: number;
  requiredCustomerPrice: number;
  pricePerSquare: number;
  costPerSquare: number;
  insuranceScopeMargin: number;
  insuranceScopePerSquare: number;
  onReset: () => void;
  onSave: () => void;
  onGeneratePdf: () => void;
  onTargetMarginChange: (value: number) => void;
  onInsuranceScopePriceChange: (value: number) => void;
}

const MARGIN_PRESETS = [30, 35, 40, 45, 50];

export default function EstimateSummary(props: EstimateSummaryProps) {
  const [marginExpanded, setMarginExpanded] = useState(true);
  const [insuranceExpanded, setInsuranceExpanded] = useState(false);
  const [materialOrderOpen, setMaterialOrderOpen] = useState(false);
  const [workOrderOpen, setWorkOrderOpen] = useState(false);

  const supplierName = SUPPLIERS.find((s) => s.id === props.state.supplier)?.name || props.state.supplier;
  const shingleName = SHINGLE_TYPES.find((s) => s.id === props.state.shingleType)?.name || props.state.shingleType;
  const additionalCostsTotal = props.state.additionalCosts.reduce((s, i) => s + (i.amount || 0), 0);

  const hasData = props.estimateTotal > 0;
  const scopeIsGood = props.state.insuranceScopePrice > 0 && props.insuranceScopeMargin >= props.state.targetMarginPct;
  const scopeIsBad = props.state.insuranceScopePrice > 0 && props.insuranceScopeMargin < props.state.targetMarginPct;

  return (
    <>
      <div className="space-y-3">
        {/* Main summary card */}
        <div className="section-card">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {props.state.jobName || "Estimate Summary"}
            </div>
            {props.state.address && (
              <div className="text-xs text-muted-foreground">{props.state.address}</div>
            )}
            {(shingleName || supplierName) && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {supplierName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-muted-foreground">
                    {supplierName}
                  </span>
                )}
                {shingleName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary">
                    {shingleName}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shingle Squares</span>
              <span className="font-num font-medium">{props.shingleSquares.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Labor Squares</span>
              <span className="font-num font-medium">{props.laborSquares.toFixed(1)}</span>
            </div>

            <div className="border-t border-border/40 pt-2 mt-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  Materials ({props.materialItemCount})
                </span>
                <span className="font-num font-medium">{formatCurrency(props.totalMaterialCost)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  Labor
                </span>
                <span className="font-num font-medium">{formatCurrency(props.totalLaborCost)}</span>
              </div>
              {props.steepPitchAdder > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                  <span>Steep pitch adder</span>
                  <span className="font-num">{formatCurrency(props.steepPitchAdder)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Additional
                </span>
                <span className="font-num font-medium">{formatCurrency(props.totalCustomCosts)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                <span>Tarp System (fixed)</span>
                <span className="font-num">{formatCurrency(TARP_SYSTEM_CHARGE)}</span>
              </div>
              {props.state.deliveryEnabled && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                  <span>Delivery</span>
                  <span className="font-num">{formatCurrency(props.state.deliveryCost)}</span>
                </div>
              )}
              {additionalCostsTotal > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pl-3">
                  <span>Custom items</span>
                  <span className="font-num">{formatCurrency(additionalCostsTotal)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total Cost</span>
                <span className="text-2xl font-bold font-num text-primary">
                  {formatCurrency(props.estimateTotal)}
                </span>
              </div>
              {props.shingleSquares > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                  <span>Cost per square</span>
                  <span className="font-num">{formatCurrency(props.costPerSquare)}/sq</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Margin Calculator */}
        <div className="section-card">
          <button
            type="button"
            className="section-header w-full text-left"
            onClick={() => setMarginExpanded(!marginExpanded)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">Margin Calculator</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${marginExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {marginExpanded && (
            <div className="border-t border-border/60 px-5 py-4 space-y-4">
              {/* Target margin input */}
              <div>
                <label className="field-label">Target Gross Margin</label>
                <div className="flex items-center gap-2 mb-2.5">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    step="1"
                    value={props.state.targetMarginPct}
                    onChange={(e) => props.onTargetMarginChange(parseFloat(e.target.value) || 0)}
                    className="w-20 px-3 py-2 text-xl font-bold text-center border-2 border-primary rounded-xl bg-background focus:outline-none font-num"
                  />
                  <span className="text-xl font-bold text-primary">%</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {MARGIN_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => props.onTargetMarginChange(preset)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                        props.state.targetMarginPct === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {hasData ? (
                <div className="space-y-3">
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">Charge customer</div>
                    <div className="text-2xl font-bold font-num text-primary">
                      {formatCurrency(props.requiredCustomerPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      For {props.state.targetMarginPct}% gross margin
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary/60 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground mb-1">Your Cost/sq</div>
                      <div className="text-base font-bold font-num">{formatCurrency(props.costPerSquare)}</div>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground mb-1">Charge/sq</div>
                      <div className="text-base font-bold font-num text-primary">{formatCurrency(props.pricePerSquare)}</div>
                    </div>
                  </div>

                  {/* Comparison table */}
                  <div className="border border-border/60 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-secondary/40">
                          <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Margin</th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">Price</th>
                          <th className="text-right px-3 py-2 font-semibold text-muted-foreground">$/sq</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[30, 35, 40, 45, 50].map((m) => {
                          const price = props.estimateTotal / (1 - m / 100);
                          const pps = props.shingleSquares > 0 ? price / props.shingleSquares : 0;
                          const isTarget = m === props.state.targetMarginPct;
                          return (
                            <tr key={m} className={isTarget ? "bg-primary/5" : ""}>
                              <td className={`px-3 py-2 ${isTarget ? "text-primary font-bold" : ""}`}>{m}%</td>
                              <td className={`px-3 py-2 text-right font-num ${isTarget ? "text-primary font-bold" : ""}`}>{formatCurrency(price)}</td>
                              <td className={`px-3 py-2 text-right font-num ${isTarget ? "text-primary font-bold" : ""}`}>{formatCurrency(pps)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 border border-dashed border-border/60 rounded-xl">
                  <p className="text-xs text-muted-foreground">Enter materials and labor to see margin calculations</p>
                </div>
              )}

              {/* Insurance scope check */}
              <div className="pt-3 border-t border-border/60">
                <button
                  type="button"
                  className="flex items-center justify-between w-full mb-3"
                  onClick={() => setInsuranceExpanded(!insuranceExpanded)}
                >
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer">
                    Insurance Scope Check
                  </label>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${insuranceExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {insuranceExpanded && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Enter the insurance scope price to see your actual margin.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="0.00"
                        value={props.state.insuranceScopePrice || ""}
                        onChange={(e) => props.onInsuranceScopePriceChange(parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2.5 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 font-num"
                      />
                    </div>

                    {props.state.insuranceScopePrice > 0 && hasData && (
                      <div className={`rounded-xl p-3.5 border ${scopeIsGood ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-semibold ${scopeIsGood ? "text-emerald-700" : "text-red-700"}`}>
                            {scopeIsGood ? "✓ Scope looks good!" : "⚠ Below target margin"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Scope price:</span>
                            <span className="font-bold ml-1">{formatCurrency(props.state.insuranceScopePrice)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Scope $/sq:</span>
                            <span className="font-bold ml-1">{formatCurrency(props.insuranceScopePerSquare)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Actual margin:</span>
                            <span className={`font-bold ml-1 ${scopeIsGood ? "text-emerald-700" : "text-red-700"}`}>
                              {props.insuranceScopeMargin.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <span className="font-bold ml-1">{props.state.targetMarginPct}%</span>
                          </div>
                        </div>
                        {scopeIsBad && (
                          <p className="text-xs text-red-700 font-medium mt-2">
                            {(props.state.targetMarginPct - props.insuranceScopeMargin).toFixed(1)}% below target — need {formatCurrency(props.requiredCustomerPrice)} to hit {props.state.targetMarginPct}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="section-card">
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Documents</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={props.onGeneratePdf}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:opacity-80"
              >
                <FileText className="w-4 h-4" />
                Generate Estimate PDF
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaterialOrderOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border rounded-xl text-xs font-medium hover:bg-secondary transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  Material Order
                </button>
                <button
                  type="button"
                  onClick={() => setWorkOrderOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-border rounded-xl text-xs font-medium hover:bg-secondary transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Work Order
                </button>
              </div>
              <button
                type="button"
                onClick={props.onSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Estimate
              </button>
              <button
                type="button"
                onClick={props.onReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MaterialOrderModal
        isOpen={materialOrderOpen}
        onClose={() => setMaterialOrderOpen(false)}
        state={props.state}
        shingleSquares={props.shingleSquares}
        laborSquares={props.laborSquares}
      />
      <WorkOrderModal
        isOpen={workOrderOpen}
        onClose={() => setWorkOrderOpen(false)}
        state={props.state}
        shingleSquares={props.shingleSquares}
        laborSquares={props.laborSquares}
        laborTotal={props.totalLaborCost}
      />
    </>
  );
}
