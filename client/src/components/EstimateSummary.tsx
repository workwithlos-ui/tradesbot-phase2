import { useState } from "react";
import { FileText, Save, RotateCcw, TrendingUp, ChevronDown, Package, Wrench, Shield } from "lucide-react";
import MaterialOrderModal from "@/components/MaterialOrderModal";
import WorkOrderModal from "@/components/WorkOrderModal";
import { SUPPLIERS, SHINGLE_TYPES, TARP_SYSTEM_CHARGE } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import type { MaterialCostLine, LaborCostLine } from "@/lib/data";

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface EstimateSummaryProps {
  state: EstimatorState;
  materialCostLines: MaterialCostLine[];
  laborCostLines: LaborCostLine[];
  totalSquares: number;
  totalMaterialCost: number;
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
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>
              {props.state.jobName || "Estimate Summary"}
            </div>
            {props.state.address && (
              <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{props.state.address}</div>
            )}
            {(shingleName || supplierName) && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {supplierName && (
                  <span className="pill" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    {supplierName}
                  </span>
                )}
                {shingleName && (
                  <span className="pill" style={{ background: "rgba(0,212,170,0.1)", color: "var(--primary)" }}>
                    {shingleName}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--muted-foreground)" }}>Roof Squares</span>
              <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{props.totalSquares}</span>
            </div>

            <div className="pt-2 mt-2 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--primary)" }} />
                  Materials
                </span>
                <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalMaterialCost)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#FBBF24" }} />
                  Labor
                </span>
                <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalLaborCost)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#A78BFA" }} />
                  Additional
                </span>
                <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalCustomCosts)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pl-3" style={{ color: "var(--muted-foreground)" }}>
                <span>Tarp System (fixed)</span>
                <span className="font-num">{fmt(TARP_SYSTEM_CHARGE)}</span>
              </div>
              {props.state.deliveryEnabled && (
                <div className="flex items-center justify-between text-[11px] pl-3" style={{ color: "var(--muted-foreground)" }}>
                  <span>Delivery</span>
                  <span className="font-num">{fmt(props.state.deliveryCost)}</span>
                </div>
              )}
              {additionalCostsTotal > 0 && (
                <div className="flex items-center justify-between text-[11px] pl-3" style={{ color: "var(--muted-foreground)" }}>
                  <span>Custom items</span>
                  <span className="font-num">{fmt(additionalCostsTotal)}</span>
                </div>
              )}
            </div>

            <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Total Cost</span>
                <span className="text-2xl font-bold font-num" style={{ color: "var(--primary)" }}>
                  {fmt(props.estimateTotal)}
                </span>
              </div>
              {props.totalSquares > 0 && (
                <div className="flex justify-between text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  <span>Cost per square</span>
                  <span className="font-num">{fmt(props.costPerSquare)}/sq</span>
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,212,170,0.08)", color: "var(--primary)" }}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Margin Calculator</span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{ color: "var(--muted-foreground)", transform: marginExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {marginExpanded && (
            <div className="px-5 py-4 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
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
                    className="font-num text-xl font-bold text-center"
                    style={{
                      width: "72px",
                      padding: "0.5rem",
                      background: "var(--background)",
                      border: "2px solid var(--primary)",
                      borderRadius: "0.75rem",
                      color: "var(--primary)",
                      outline: "none",
                    }}
                  />
                  <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>%</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {MARGIN_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => props.onTargetMarginChange(preset)}
                      className="px-2.5 py-1.5 text-[11px] rounded-lg transition-all"
                      style={{
                        background: props.state.targetMarginPct === preset ? "var(--primary)" : "transparent",
                        color: props.state.targetMarginPct === preset ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        border: props.state.targetMarginPct === preset ? "1px solid var(--primary)" : "1px solid var(--border)",
                      }}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {hasData ? (
                <div className="space-y-3">
                  <div className="surface-highlight rounded-lg p-4">
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Charge customer</div>
                    <div className="text-2xl font-bold font-num" style={{ color: "var(--primary)" }}>
                      {fmt(props.requiredCustomerPrice)}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                      For {props.state.targetMarginPct}% gross margin
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg p-3 text-center" style={{ background: "var(--secondary)" }}>
                      <div className="text-[9px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Your Cost/sq</div>
                      <div className="text-base font-bold font-num" style={{ color: "var(--foreground)" }}>{fmt(props.costPerSquare)}</div>
                    </div>
                    <div className="surface-highlight rounded-lg p-3 text-center">
                      <div className="text-[9px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>Charge/sq</div>
                      <div className="text-base font-bold font-num" style={{ color: "var(--primary)" }}>{fmt(props.pricePerSquare)}</div>
                    </div>
                  </div>

                  {/* Comparison table */}
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr style={{ background: "var(--secondary)" }}>
                          <th className="text-left px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Margin</th>
                          <th className="text-right px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Price</th>
                          <th className="text-right px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>$/sq</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[30, 35, 40, 45, 50].map((m) => {
                          const price = props.estimateTotal / (1 - m / 100);
                          const pps = props.totalSquares > 0 ? price / props.totalSquares : 0;
                          const isTarget = m === props.state.targetMarginPct;
                          return (
                            <tr key={m} style={{ background: isTarget ? "rgba(0,212,170,0.06)" : "transparent" }}>
                              <td className="px-3 py-2" style={{ color: isTarget ? "var(--primary)" : "var(--muted-foreground)", fontWeight: isTarget ? 700 : 400 }}>{m}%</td>
                              <td className="px-3 py-2 text-right font-num" style={{ color: isTarget ? "var(--primary)" : "var(--foreground)", fontWeight: isTarget ? 700 : 400 }}>{fmt(price)}</td>
                              <td className="px-3 py-2 text-right font-num" style={{ color: isTarget ? "var(--primary)" : "var(--foreground)", fontWeight: isTarget ? 700 : 400 }}>{fmt(pps)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 rounded-lg" style={{ border: "1px dashed var(--border)" }}>
                  <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Enter measurements to see margin calculations</p>
                </div>
              )}

              {/* Insurance scope check */}
              <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  type="button"
                  className="flex items-center justify-between w-full mb-3"
                  onClick={() => setInsuranceExpanded(!insuranceExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
                    <label className="text-[10px] font-semibold uppercase tracking-widest cursor-pointer" style={{ color: "var(--muted-foreground)" }}>
                      Insurance Scope Check
                    </label>
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{ color: "var(--muted-foreground)", transform: insuranceExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {insuranceExpanded && (
                  <div className="space-y-3">
                    <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                      Enter the insurance scope price to see your actual margin.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="0.00"
                        value={props.state.insuranceScopePrice || ""}
                        onChange={(e) => props.onInsuranceScopePriceChange(parseFloat(e.target.value) || 0)}
                        className="num-input flex-1"
                      />
                    </div>

                    {props.state.insuranceScopePrice > 0 && hasData && (
                      <div
                        className="rounded-lg p-3.5"
                        style={{
                          background: scopeIsGood ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                          border: scopeIsGood ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(239,68,68,0.15)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold" style={{ color: scopeIsGood ? "#22C55E" : "#EF4444" }}>
                            {scopeIsGood ? "Scope looks good" : "Below target margin"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span style={{ color: "var(--muted-foreground)" }}>Scope price:</span>
                            <span className="font-bold ml-1" style={{ color: "var(--foreground)" }}>{fmt(props.state.insuranceScopePrice)}</span>
                          </div>
                          <div>
                            <span style={{ color: "var(--muted-foreground)" }}>Scope $/sq:</span>
                            <span className="font-bold ml-1" style={{ color: "var(--foreground)" }}>{fmt(props.insuranceScopePerSquare)}</span>
                          </div>
                          <div>
                            <span style={{ color: "var(--muted-foreground)" }}>Actual margin:</span>
                            <span className="font-bold ml-1" style={{ color: scopeIsGood ? "#22C55E" : "#EF4444" }}>
                              {props.insuranceScopeMargin.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span style={{ color: "var(--muted-foreground)" }}>Target:</span>
                            <span className="font-bold ml-1" style={{ color: "var(--foreground)" }}>{props.state.targetMarginPct}%</span>
                          </div>
                        </div>
                        {scopeIsBad && (
                          <p className="text-[11px] font-medium mt-2" style={{ color: "#EF4444" }}>
                            {(props.state.targetMarginPct - props.insuranceScopeMargin).toFixed(1)}% below target -- need {fmt(props.requiredCustomerPrice)} to hit {props.state.targetMarginPct}%
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
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Documents</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={props.onGeneratePdf}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <FileText className="w-4 h-4" />
                Generate Estimate PDF
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaterialOrderOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                >
                  <Package className="w-3.5 h-3.5" />
                  Material Order
                </button>
                <button
                  type="button"
                  onClick={() => setWorkOrderOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Work Order
                </button>
              </div>
              <button
                type="button"
                onClick={props.onSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                <Save className="w-4 h-4" />
                Save Estimate
              </button>
              <button
                type="button"
                onClick={props.onReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm transition-colors"
                style={{ color: "var(--muted-foreground)" }}
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
        materialCostLines={props.materialCostLines}
        totalMaterialCost={props.totalMaterialCost}
      />
      <WorkOrderModal
        isOpen={workOrderOpen}
        onClose={() => setWorkOrderOpen(false)}
        state={props.state}
        laborCostLines={props.laborCostLines}
        totalLaborCost={props.totalLaborCost}
      />
    </>
  );
}
