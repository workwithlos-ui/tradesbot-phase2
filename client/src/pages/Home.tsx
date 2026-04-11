import AppHeader from "@/components/AppHeader";
import TradeSelector from "@/components/TradeSelector";
import JobInfoSection from "@/components/JobInfoSection";
import RoofMeasurementsSection from "@/components/RoofMeasurementsSection";
import MaterialsSection from "@/components/MaterialsSection";
import LaborSection from "@/components/LaborSection";
import CustomCostsSection from "@/components/CustomCostsSection";
import EstimateSummary from "@/components/EstimateSummary";
import MobileSummaryBar from "@/components/MobileSummaryBar";
import ComingSoon from "@/components/ComingSoon";
import { useEstimator } from "@/hooks/useEstimator";
import { Link } from "wouter";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { saveEstimate } from "@/lib/estimateStorage";
import { generateEstimatePdf } from "@/lib/generatePdf";

export default function Home() {
  const e = useEstimator();
  const isShingleRoofing = e.state.selectedTrade === "shingle-roofing";

  const handleSave = () => {
    const saved = saveEstimate(
      e.state,
      e.totalSquares,
      e.estimateTotal
    );
    toast.success(`Estimate "${saved.name}" saved.`);
  };

  const handleGeneratePdf = () => {
    if (e.totalSquares <= 0) {
      toast.error("Enter roof measurements before generating a PDF.");
      return;
    }
    try {
      generateEstimatePdf({
        state: e.state,
        materialCostLines: e.materialCostLines,
        laborCostLines: e.laborCostLines,
        totalSquares: e.totalSquares,
        totalMaterialCost: e.totalMaterialCost,
        totalLaborCost: e.totalLaborCost,
        tarpCharge: e.tarpCharge,
        totalCustomCosts: e.totalCustomCosts,
        estimateTotal: e.estimateTotal,
        requiredCustomerPrice: e.requiredCustomerPrice,
        targetMarginPct: e.state.targetMarginPct,
      });
      toast.success("PDF generated — check your downloads.");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("PDF generation failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <AppHeader />
      <TradeSelector
        selectedTrade={e.state.selectedTrade}
        onTradeChange={e.setTrade}
      />

      {/* Saved estimates link */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container flex items-center justify-end py-2">
          <Link
            href="/estimates"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--primary)" }}
          >
            <ClipboardList className="w-4 h-4" />
            Saved Estimates
          </Link>
        </div>
      </div>

      {isShingleRoofing ? (
        <main className="flex-1 container py-6 pb-28 lg:pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column: Form sections */}
            <div className="flex-1 space-y-3 min-w-0">
              <JobInfoSection
                customerName={e.state.customerName}
                customerPhone={e.state.customerPhone}
                customerEmail={e.state.customerEmail}
                jobName={e.state.jobName}
                address={e.state.address}
                supplier={e.state.supplier}
                shingleType={e.state.shingleType}
                market={e.state.market}
                onJobInfoChange={e.setJobInfo}
                onSupplierChange={e.setSupplier}
                onShingleTypeChange={e.setShingleType}
                onMarketChange={e.setMarket}
              />
              <RoofMeasurementsSection
                measurements={e.state.measurements}
                wasteFactor={e.state.wasteFactor}
                calculatedMaterials={e.calculatedMaterials}
                shingleBundlesPerSq={e.shingleTypeObj.bundlesPerSquare}
                onMeasurementChange={e.setMeasurement}
                onWasteFactorChange={e.setWasteFactor}
              />
              <MaterialsSection
                materialCostLines={e.materialCostLines}
                totalMaterialCost={e.totalMaterialCost}
                totalSquares={e.totalSquares}
              />
              <LaborSection
                laborCostLines={e.laborCostLines}
                totalLaborCost={e.totalLaborCost}
                totalSquares={e.totalSquares}
                laborOverrides={e.state.laborOverrides}
                onLaborOverride={e.setLaborOverride}
              />
              <CustomCostsSection
                deliveryEnabled={e.state.deliveryEnabled}
                deliveryCost={e.state.deliveryCost}
                onDeliveryChange={e.setDelivery}
                onDeliveryCostChange={e.setDeliveryCost}
                additionalCosts={e.state.additionalCosts}
                onAddAdditionalCost={e.addAdditionalCost}
                onUpdateAdditionalCost={e.updateAdditionalCost}
                onRemoveAdditionalCost={e.removeAdditionalCost}
                tarpCharge={e.tarpCharge}
                totalCustomCosts={e.totalCustomCosts}
              />
            </div>

            {/* Right column: Summary (desktop only) */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-6">
                <EstimateSummary
                  state={e.state}
                  materialCostLines={e.materialCostLines}
                  laborCostLines={e.laborCostLines}
                  totalSquares={e.totalSquares}
                  totalMaterialCost={e.totalMaterialCost}
                  totalLaborCost={e.totalLaborCost}
                  tarpCharge={e.tarpCharge}
                  totalCustomCosts={e.totalCustomCosts}
                  estimateTotal={e.estimateTotal}
                  requiredCustomerPrice={e.requiredCustomerPrice}
                  pricePerSquare={e.pricePerSquare}
                  costPerSquare={e.costPerSquare}
                  insuranceScopeMargin={e.insuranceScopeMargin}
                  insuranceScopePerSquare={e.insuranceScopePerSquare}
                  onReset={e.resetForm}
                  onSave={handleSave}
                  onGeneratePdf={handleGeneratePdf}
                  onTargetMarginChange={e.setTargetMarginPct}
                  onInsuranceScopePriceChange={e.setInsuranceScopePrice}
                />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 container py-6">
          <ComingSoon tradeId={e.state.selectedTrade} />
        </main>
      )}

      <MobileSummaryBar
        state={e.state}
        totalSquares={e.totalSquares}
        totalMaterialCost={e.totalMaterialCost}
        totalLaborCost={e.totalLaborCost}
        totalCustomCosts={e.totalCustomCosts}
        estimateTotal={e.estimateTotal}
        requiredCustomerPrice={e.requiredCustomerPrice}
        costPerSquare={e.costPerSquare}
        pricePerSquare={e.pricePerSquare}
        onTargetMarginChange={e.setTargetMarginPct}
        onReset={e.resetForm}
        onSave={handleSave}
        onGeneratePdf={handleGeneratePdf}
      />
    </div>
  );
}