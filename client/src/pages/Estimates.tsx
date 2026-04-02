import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  calculateShingleSquares,
  calculateLaborSquares,
  calculateMaterialCost,
  calculateSteepPitchAdder,
  LABOR_ITEMS,
  BASE_LABOR_RATE,
  TARP_SYSTEM_CHARGE,
} from "@/lib/data";

export default function Estimates() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);

  useEffect(() => {
    setEstimates(getSavedEstimates());
  }, []);

  const handleDelete = (id: string, name: string) => {
    deleteEstimate(id);
    setEstimates(getSavedEstimates());
    toast.success('"' + name + '" deleted.');
  };

  const handleRegenPdf = (estimate: SavedEstimate) => {
    const { state } = estimate;
    const shingleSquares = calculateShingleSquares(state.materialQtys);
    const laborSquares = calculateLaborSquares(state.materialQtys);
    const totalMaterialCost = calculateMaterialCost(state.materialQtys);
    const steepPitchSquares = state.steepPitchSquares || {};
    const steepPitchAdder = calculateSteepPitchAdder(steepPitchSquares);
    const baseCost = laborSquares * (state.laborCosts?.["base-labor"] || BASE_LABOR_RATE);
    let additionalLabor = 0;
    for (const item of LABOR_ITEMS) {
      if (item.isBaseLabor) continue;
      const qty = state.laborQtys?.[item.id] || 0;
      const cost = state.laborCosts?.[item.id] || item.defaultCostPerUnit;
      additionalLabor += qty * cost;
    }
    const totalLaborCost = baseCost + steepPitchAdder + additionalLabor;

    // Calculate additional costs: tarp + delivery + free-form items
    const tarpCharge = TARP_SYSTEM_CHARGE;
    const deliveryCostTotal = state.deliveryEnabled ? (state.deliveryCost || 0) : 0;
    const additionalCosts = state.additionalCosts || [];
    const additionalCostsTotal = additionalCosts.reduce((sum: number, item: { amount?: number }) => sum + (item.amount || 0), 0);
    const totalCustomCosts = tarpCharge + deliveryCostTotal + additionalCostsTotal;

    const estimateTotal = totalMaterialCost + totalLaborCost + totalCustomCosts;

    generateEstimatePdf({
      state,
      shingleSquares,
      laborSquares,
      totalMaterialCost,
      totalLaborCost,
      tarpCharge,
      deliveryCostTotal,
      additionalCostsTotal,
      totalCustomCosts,
      estimateTotal,
    });
    toast.success("PDF regenerated!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Saved Estimates
                </h2>
                <p className="text-sm text-muted-foreground">
                  {estimates.length} estimate{estimates.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>
          </div>

          {estimates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No saved estimates
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  Create an estimate on the main page and click "Save Estimate" to see it here.
                </p>
                <Link href="/">
                  <Button size="sm">Create Estimate</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {estimates.map((estimate) => (
                <Card key={estimate.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {estimate.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                          {estimate.customerName && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              {estimate.customerName}
                            </span>
                          )}
                          {estimate.address && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {estimate.address}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(estimate.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {estimate.totalSquares.toFixed(1)} sq
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                            ${estimate.estimateTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => handleRegenPdf(estimate)}
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{estimate.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(estimate.id, estimate.name)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
