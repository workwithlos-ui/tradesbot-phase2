import AppHeader from "@/components/AppHeader";
import JobInfoSection from "@/components/JobInfoSection";
import MaterialsSection from "@/components/MaterialsSection";
import LaborSection from "@/components/LaborSection";
import CustomCostsSection from "@/components/CustomCostsSection";
import EstimateSummary from "@/components/EstimateSummary";
import MobileSummaryBar from "@/components/MobileSummaryBar";
import { useEstimator } from "@/hooks/useEstimator";
import { Link } from "wouter";
import { ClipboardList } from "lucide-react";

export default function Home() {
  const estimator = useEstimator();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

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

      <main className="flex-1 container py-6 pb-24 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Form sections */}
          <div className="flex-1 space-y-4 min-w-0">
            <JobInfoSection
              jobName={estimator.state.jobName}
              address={estimator.state.address}
              supplier={estimator.state.supplier}
              shingleType={estimator.state.shingleType}
              steepPitchTier={estimator.state.steepPitchTier}
              secondStory={estimator.state.secondStory}
              totalSquares={estimator.totalSquares}
              customerName={estimator.state.customerName}
              customerPhone={estimator.state.customerPhone}
              customerEmail={estimator.state.customerEmail}
              onJobInfoChange={estimator.setJobInfo}
              onSupplierChange={estimator.setSupplier}
              onShingleTypeChange={estimator.setShingleType}
              onSteepPitchChange={estimator.setSteepPitchTier}
              onSecondStoryChange={estimator.setSecondStory}
            />
            <MaterialsSection
              materialQtys={estimator.state.materialQtys}
              onMaterialQtyChange={estimator.setMaterialQty}
              totalSquares={estimator.totalSquares}
            />
            <LaborSection
              laborQuantities={estimator.laborQuantities}
              laborCosts={estimator.state.laborCosts}
              onLaborCostChange={estimator.setLaborCost}
              totalSquares={estimator.totalSquares}
            />
            <CustomCostsSection
              customCosts={estimator.state.customCosts}
              customCostEnabled={estimator.state.customCostEnabled}
              deliveryEnabled={estimator.state.deliveryEnabled}
              deliveryCost={estimator.state.deliveryCost}
              onCustomCostChange={estimator.setCustomCost}
              onToggleCustomCost={estimator.toggleCustomCost}
              onDeliveryChange={estimator.setDelivery}
              onDeliveryCostChange={estimator.setDeliveryCost}
            />
          </div>

          {/* Right column: Estimate Summary (sticky) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6">
              <EstimateSummary
                jobName={estimator.state.jobName}
                address={estimator.state.address}
                supplier={estimator.state.supplier}
                shingleType={estimator.state.shingleType}
                totalSquares={estimator.totalSquares}
                materialItemCount={estimator.materialItemCount}
                laborItemCount={estimator.laborItemCount}
                totalCustomCosts={estimator.totalCustomCosts}
                deliveryEnabled={estimator.state.deliveryEnabled}
                deliveryCost={estimator.state.deliveryCost}
                steepPitchTier={estimator.state.steepPitchTier}
                secondStory={estimator.state.secondStory}
                laborQuantities={estimator.laborQuantities}
                laborCosts={estimator.state.laborCosts}
                customCosts={estimator.state.customCosts}
                customCostEnabled={estimator.state.customCostEnabled}
                totalLaborCost={estimator.totalLaborCost}
                state={estimator.state}
                onReset={estimator.resetForm}
              />
            </div>
          </div>
        </div>
      </main>

      <MobileSummaryBar
        totalSquares={estimator.totalSquares}
        materialItemCount={estimator.materialItemCount}
        laborItemCount={estimator.laborItemCount}
      />
    </div>
  );
}
