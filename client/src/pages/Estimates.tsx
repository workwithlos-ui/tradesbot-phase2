import { useState, useEffect } from "react";
import { Link } from "wouter";
import AppHeader from "@/components/AppHeader";
import {
  getSavedEstimates,
  deleteEstimate,
  type SavedEstimate,
} from "@/lib/estimateStorage";
import {
  ArrowLeft,
  Trash2,
  FileText,
  MapPin,
  User,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { generateEstimatePdf } from "@/lib/generatePdf";
import {
  SHINGLE_TYPES,
  MARKET_CONFIGS,
  TARP_SYSTEM_CHARGE,
  getDefaultMeasurements,
  getTotalSquares,
  calculateMaterials,
  calculateMaterialCostLines,
  calculateLaborCostLines,
  calculatePriceForMargin,
} from "@/lib/data";

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Estimates() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setEstimates(getSavedEstimates());
  }, []);

  const handleDelete = (id: string, name: string) => {
    deleteEstimate(id);
    setEstimates(getSavedEstimates());
    setDeleteConfirm(null);
    toast.success(`"${name}" deleted.`);
  };

  const handleRegenPdf = (estimate: SavedEstimate) => {
    const { state } = estimate;
    const measurements = state.measurements || getDefaultMeasurements();
    const shingleType = SHINGLE_TYPES.find(s => s.id === state.shingleType) || SHINGLE_TYPES[0];
    const market = MARKET_CONFIGS.find(m => m.id === state.market) || MARKET_CONFIGS[0];
    const wasteFactor = state.wasteFactor ?? 8;

    const calculatedMaterials = calculateMaterials(measurements, shingleType, wasteFactor);
    const materialCostLines = calculateMaterialCostLines(calculatedMaterials, shingleType, measurements);
    const laborCostLines = calculateLaborCostLines(measurements, calculatedMaterials, market.baseLaborRate, state.laborOverrides || {});

    const totalMaterialCost = materialCostLines.reduce((sum, l) => sum + l.total, 0);
    const totalLaborCost = laborCostLines.reduce((sum, l) => sum + l.total, 0);
    const tarpCharge = TARP_SYSTEM_CHARGE;
    const deliveryCostTotal = state.deliveryEnabled ? (state.deliveryCost || 0) : 0;
    const additionalCosts = state.additionalCosts || [];
    const additionalCostsTotal = additionalCosts.reduce((sum: number, item: { amount?: number }) => sum + (item.amount || 0), 0);
    const totalCustomCosts = tarpCharge + deliveryCostTotal + additionalCostsTotal;
    const estimateTotal = totalMaterialCost + totalLaborCost + totalCustomCosts;
    const targetMarginPct = state.targetMarginPct ?? 40;
    const requiredCustomerPrice = calculatePriceForMargin(estimateTotal, targetMarginPct);

    generateEstimatePdf({
      state,
      materialCostLines,
      laborCostLines,
      totalSquares: getTotalSquares(measurements),
      totalMaterialCost,
      totalLaborCost,
      tarpCharge,
      totalCustomCosts,
      estimateTotal,
      requiredCustomerPrice,
      targetMarginPct,
    });
    toast.success("PDF regenerated!");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <AppHeader />

      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </Link>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <ClipboardList className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  Saved Estimates
                </h2>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {estimates.length} estimate{estimates.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>
          </div>

          {estimates.length === 0 ? (
            <div className="section-card flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="w-12 h-12 mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
              <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>No saved estimates</h3>
              <p className="text-[11px] mb-4 max-w-sm" style={{ color: "var(--muted-foreground)" }}>
                Create an estimate on the main page and click "Save Estimate" to see it here.
              </p>
              <Link href="/">
                <button
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Create Estimate
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="section-card">
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                          {estimate.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                          {estimate.customerName && (
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                              <User className="w-3 h-3" />
                              {estimate.customerName}
                            </span>
                          )}
                          {estimate.address && (
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                              <MapPin className="w-3 h-3" />
                              {estimate.address}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                            <Calendar className="w-3 h-3" />
                            {new Date(estimate.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="pill" style={{ background: "rgba(0,212,170,0.1)", color: "var(--primary)" }}>
                            {estimate.totalSquares} sq
                          </span>
                          <span className="pill font-num font-bold" style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
                            {fmt(estimate.estimateTotal)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRegenPdf(estimate)}
                          className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors"
                          style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </button>
                        {deleteConfirm === estimate.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(estimate.id, estimate.name)}
                              className="px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors"
                              style={{ background: "#EF4444", color: "#fff" }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors"
                              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(estimate.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#EF4444", border: "1px solid var(--border)" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}