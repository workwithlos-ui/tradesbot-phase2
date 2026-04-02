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
      estimator.shingleSquares,
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
      totalLaborCost: estimator.totalLaborCost,
      totalCustomCosts: estimator.totalCustomCosts,
      estimateTotal: estimator.estimateTotal,
    });
    toast.success("PDF generated!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <TradeSelector
        selectedTrade={estimator.state.selectedTrade}
        onTradeChange={estimator.setTrade}
      />

      {/* Nav bar with estimates link */}
      <div className="border-b border-border/60 bg-card/50">
        <div className="container flex items-center justify-between py-2">
          <div />
          <Link
            href="/estimates"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Saved Estimates
          </Link>
        </div>
      </div>

      {isShingleRoofing ? (
        <main className="flex-1 container py-6 pb-24 lg:pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column: Form sections */}
            <div className="flex-1 space-y-4 min-w-0">
              <JobInfoSection
                customerName={estimator.state.customerName}
                customerPhone={estimator.state.customerPhone}
                customerEmail={estimator.state.customerEmail}
                jobName={estimator.state.jobName}
                address={estimator.state.address}
                supplier={estimator.state.supplier}
                shingleType={estimator.state.shingleType}
                shingleSquares={estimator.shingleSquares}
                laborSquares={estimator.laborSquares}
                steepPitchSquares={estimator.state.steepPitchSquares}
                onJobInfoChange={estimator.setJobInfo}
                onSupplierChange={estimator.setSupplier}
                onShingleTypeChange={estimator.setShingleType}
                onSteepPitchSquaresChange={estimator.setSteepPitchSquares}
              />
              <MaterialsSection
                materialQtys={estimator.state.materialQtys}
                onMaterialQtyChange={estimator.setMaterialQty}
                totalSquares={estimator.shingleSquares}
                totalMaterialCost={estimator.totalMaterialCost}
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
                customCosts={estimator.state.customCosts}
                customCostEnabled={estimator.state.customCostEnabled}
                onCustomCostChange={estimator.setCustomCost}
                onToggleCustomCost={estimator.toggleCustomCost}
              />
            </div>

            {/* Right column: Estimate Summary (sticky) */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-6">
                <EstimateSummary
                  state={estimator.state}
                  shingleSquares={estimator.shingleSquares}
                  laborSquares={estimator.laborSquares}
                  materialItemCount={estimator.materialItemCount}
                  totalMaterialCost={estimator.totalMaterialCost}
                  totalLaborCost={estimator.totalLaborCost}
                  totalCustomCosts={estimator.totalCustomCosts}
                  estimateTotal={estimator.estimateTotal}
                  onReset={estimator.resetForm}
                  onSave={handleSave}
                  onGeneratePdf={handleGeneratePdf}
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
        shingleSquares={estimator.shingleSquares}
        materialItemCount={estimator.materialItemCount}
        laborItemCount={estimator.laborItemCount}
        estimateTotal={estimator.estimateTotal}
      />
    </div>
  );
}
