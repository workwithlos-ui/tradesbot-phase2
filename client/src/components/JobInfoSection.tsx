import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPLIERS, SHINGLE_TYPES, STEEP_PITCH_TIERS } from "@/lib/data";
import { User, Briefcase, Mountain } from "lucide-react";

interface JobInfoSectionProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  shingleSquares: number;
  laborSquares: number;
  steepPitchSquares: Record<string, number>;
  onJobInfoChange: (field: string, value: string) => void;
  onSupplierChange: (value: string) => void;
  onShingleTypeChange: (value: string) => void;
  onSteepPitchSquaresChange: (tierId: string, squares: number) => void;
}

export default function JobInfoSection(props: JobInfoSectionProps) {
  const selectedShingle = SHINGLE_TYPES.find((s) => s.id === props.shingleType);

  return (
    <div className="space-y-4">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="customerName" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                placeholder="John Smith"
                value={props.customerName}
                onChange={(e) => props.onJobInfoChange("customerName", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                id="customerPhone"
                type="text"
                placeholder="(555) 123-4567"
                value={props.customerPhone}
                onChange={(e) => props.onJobInfoChange("customerPhone", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="customerEmail" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                id="customerEmail"
                type="email"
                placeholder="john@example.com"
                value={props.customerEmail}
                onChange={(e) => props.onJobInfoChange("customerEmail", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Job Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="jobName" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Job Name
              </label>
              <input
                id="jobName"
                type="text"
                placeholder="e.g. Smith Residence"
                value={props.jobName}
                onChange={(e) => props.onJobInfoChange("jobName", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="123 Main St, Kansas City, MO"
                value={props.address}
                onChange={(e) => props.onJobInfoChange("address", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Supplier
              </label>
              <select
                value={props.supplier}
                onChange={(e) => props.onSupplierChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SUPPLIERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.isPrimary ? " (Primary)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Shingle Type
              </label>
              <select
                value={props.shingleType}
                onChange={(e) => props.onShingleTypeChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <optgroup label="Architectural">
                  {SHINGLE_TYPES.filter((s) => s.category === "architectural").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Designer Shingles">
                  {SHINGLE_TYPES.filter((s) => s.category === "designer").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Squares Display */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Shingle Squares</div>
              <div className="text-2xl font-bold font-num text-primary">{props.shingleSquares.toFixed(1)}</div>
              <div className="text-[10px] text-muted-foreground">From shingle bundles only</div>
            </div>
            <div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Labor Squares</div>
              <div className="text-2xl font-bold font-num text-primary">{props.laborSquares.toFixed(1)}</div>
              <div className="text-[10px] text-muted-foreground">Includes starter + ridge cap</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Every 3 bundles = 1 square. Labor squares include starter and ridge cap bundles.
            {selectedShingle && (
              <span className="ml-1 font-medium">
                Selected: {selectedShingle.name} ({selectedShingle.category})
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Roof Pitch Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-primary" />
            Roof Pitch Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Default is 4-7 pitch (standard, no upcharge). Enter squares at steeper pitches below for additional charges.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STEEP_PITCH_TIERS.map((tier) => (
              <div key={tier.id} className="bg-secondary/50 rounded-lg p-3">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {tier.label}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={props.steepPitchSquares[tier.id] || ""}
                    onChange={(e) => props.onSteepPitchSquaresChange(tier.id, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">sq</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  +${tier.adderPerSquare}/sq
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
