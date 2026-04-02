import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPLIERS, SHINGLE_TYPES, STEEP_PITCH_TIERS, MARKET_CONFIGS } from "@/lib/data";
import { User, Briefcase, Mountain, MapPin } from "lucide-react";

interface JobInfoSectionProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  market: string;
  steepPitchSquares: Record<string, number>;
  onJobInfoChange: (field: string, value: string) => void;
  onSupplierChange: (value: string) => void;
  onShingleTypeChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onSteepPitchSquaresChange: (tierId: string, squares: number) => void;
}

export default function JobInfoSection(props: JobInfoSectionProps) {
  const selectedShingle = SHINGLE_TYPES.find((s) => s.id === props.shingleType);
  const selectedMarket = MARKET_CONFIGS.find((m) => m.id === props.market);

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
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                value={props.customerName}
                onChange={(e) => props.onJobInfoChange("customerName", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={props.customerPhone}
                onChange={(e) => props.onJobInfoChange("customerPhone", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Email
              </label>
              <input
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
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Job Name
              </label>
              <input
                type="text"
                placeholder="e.g. Smith Residence"
                value={props.jobName}
                onChange={(e) => props.onJobInfoChange("jobName", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Address
              </label>
              <input
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
                <optgroup label="Main Shingles (Architectural)">
                  {SHINGLE_TYPES.filter((s) => s.category === "architectural").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Budget">
                  {SHINGLE_TYPES.filter((s) => s.category === "budget").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Designer / Premium">
                  {SHINGLE_TYPES.filter((s) => s.category === "designer").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {selectedShingle && (
            <p className="text-xs text-muted-foreground mt-2">
              Selected: <span className="font-medium">{selectedShingle.name}</span> ({selectedShingle.category})
            </p>
          )}
        </CardContent>
      </Card>

      {/* Market / Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Job Market / Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Labor rates differ by market. Selecting the market auto-sets the base labor rate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MARKET_CONFIGS.map((market) => (
              <button
                key={market.id}
                onClick={() => props.onMarketChange(market.id)}
                className={`flex flex-col items-start p-3 rounded-lg border-2 text-left transition-all ${
                  props.market === market.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-sm font-semibold">{market.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Base labor: ${market.baseLaborRate}/sq
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{market.description}</span>
              </button>
            ))}
          </div>
          {selectedMarket && (
            <p className="text-xs text-muted-foreground mt-3">
              Active market: <span className="font-medium text-primary">{selectedMarket.name}</span> — base labor rate set to ${selectedMarket.baseLaborRate}/sq
            </p>
          )}
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
            Default is 4-7 pitch (standard, no upcharge). Enter squares at steeper pitches for additional charges.
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
