import AppHeader from "@/components/AppHeader";
import TradeSelector from "@/components/TradeSelector";
import JobInfoSection from "@/components/JobInfoSection";
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
  const estimator = useEstimator();
  const isShingleRoofing = estimator.state.selectedTrade === "shingle-roofing";

  const handleSave = () => {
    const saved = saveEstimate(
      estimator.state,
      estimator.laborSquares,
      estimator.estimateTotal
    );
    toast.success(`Estimate "${saved.name}" saved.`);
  };

  const handleGeneratePdf = () => {
    generateEstimatePdf({
      state: estimator.state,
      shingleSquares: estimator.shingleSquares,
      laborSquares: estimator.laborSquares,
      totalMaterialCost: estimator.totalMaterialCost,
      baseLaborCost: estimator.baseLaborCost,
      additionalLaborCost: estimator.additionalLaborCost,
      steepPitchAdder: estimator.steepPitchAdder,
      totalLaborCost: estimator.totalLaborCost,
      tarpCharge: estimator.tarpCharge,
      deliveryCostTotal: estimator.deliveryCostTotal,
      additionalCostsTotal: estimator.additionalCostsTotal,
      totalCustomCosts: estimator.totalCustomCosts,
      estimateTotal: estimator.estimateTotal,
      requiredCustomerPrice: estimator.requiredCustomerPrice,
      targetMarginPct: estimator.state.targetMarginPct,
    });
    toast.success("PDF generated!");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <AppHeader />
      <TradeSelector
        selectedTrade={estimator.state.selectedTrade}
        onTradeChange={estimator.setTrade}
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
                customerName={estimator.state.customerName}
                customerPhone={estimator.state.customerPhone}
                customerEmail={estimator.state.customerEmail}
                jobName={estimator.state.jobName}
                address={estimator.state.address}
                supplier={estimator.state.supplier}
                shingleType={estimator.state.shingleType}
                market={estimator.state.market}
                steepPitchSquares={estimator.state.steepPitchSquares}
                onJobInfoChange={estimator.setJobInfo}
                onSupplierChange={estimator.setSupplier}
                onShingleTypeChange={estimator.setShingleType}
                onMarketChange={estimator.setMarket}
                onSteepPitchSquaresChange={estimator.setSteepPitchSquares}
              />
              <MaterialsSection
                materialQtys={estimator.state.materialQtys}
                onMaterialQtyChange={estimator.setMaterialQty}
                shingleSquares={estimator.shingleSquares}
                laborSquares={estimator.laborSquares}
                totalMaterialCost={estimator.totalMaterialCost}
                wasteFactor={estimator.state.wasteFactor}
                onWasteFactorChange={estimator.setWasteFactor}
              />
              <LaborSection
                laborSquares={estimator.laborSquares}
                laborQtys={estimator.state.laborQtys}
                laborCosts={estimator.state.laborCosts}
                steepPitchSquares={estimator.state.steepPitchSquares}
                baseLaborCost={estimator.baseLaborCost}
                steepPitchAdder={estimator.steepPitchAdder}
                additionalLaborCost={estimator.additionalLaborCost}
                totalLaborCost={estimator.totalLaborCost}
                onLaborQtyChange={estimator.setLaborQty}
                onLaborCostChange={estimator.setLaborCost}
              />
              <CustomCostsSection
                deliveryEnabled={estimator.state.deliveryEnabled}
                deliveryCost={estimator.state.deliveryCost}
                onDeliveryChange={estimator.setDelivery}
                onDeliveryCostChange={estimator.setDeliveryCost}
                additionalCosts={estimator.state.additionalCosts}
                onAddAdditionalCost={estimator.addAdditionalCost}
                onUpdateAdditionalCost={estimator.updateAdditionalCost}
                onRemoveAdditionalCost={estimator.removeAdditionalCost}
                tarpCharge={estimator.tarpCharge}
                totalCustomCosts={estimator.totalCustomCosts}
              />
            </div>

            {/* Right column: Summary (desktop only) */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-6">
                <EstimateSummary
                  state={estimator.state}
                  shingleSquares={estimator.shingleSquares}
                  laborSquares={estimator.laborSquares}
                  materialItemCount={estimator.materialItemCount}
                  totalMaterialCost={estimator.totalMaterialCost}
                  baseLaborCost={estimator.baseLaborCost}
                  additionalLaborCost={estimator.additionalLaborCost}
                  steepPitchAdder={estimator.steepPitchAdder}
                  totalLaborCost={estimator.totalLaborCost}
                  tarpCharge={estimator.tarpCharge}
                  totalCustomCosts={estimator.totalCustomCosts}
                  estimateTotal={estimator.estimateTotal}
                  requiredCustomerPrice={estimator.requiredCustomerPrice}
                  pricePerSquare={estimator.pricePerSquare}
                  costPerSquare={estimator.costPerSquare}
                  insuranceScopeMargin={estimator.insuranceScopeMargin}
                  insuranceScopePerSquare={estimator.insuranceScopePerSquare}
                  onReset={estimator.resetForm}
                  onSave={handleSave}
                  onGeneratePdf={handleGeneratePdf}
                  onTargetMarginChange={estimator.setTargetMarginPct}
                  onInsuranceScopePriceChange={estimator.setInsuranceScopePrice}
                />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 container py-6">
          <ComingSoon tradeId={estimator.state.selectedTrade} />
        </main>
      )}

      <MobileSummaryBar
        laborSquares={estimator.laborSquares}
        materialItemCount={estimator.materialItemCount}
        laborItemCount={estimator.laborItemCount}
        estimateTotal={estimator.estimateTotal}
        jobName={estimator.state.jobName}
        address={estimator.state.address}
        shingleSquares={estimator.shingleSquares}
        materialsTotal={estimator.totalMaterialCost}
        laborTotal={estimator.totalLaborCost}
        customCostsTotal={estimator.totalCustomCosts}
        targetMarginPct={estimator.state.targetMarginPct}
        requiredCustomerPrice={estimator.requiredCustomerPrice}
        onTargetMarginChange={estimator.setTargetMarginPct}
        onGeneratePdf={handleGeneratePdf}
        onSave={handleSave}
      />
    </div>
  );
}
