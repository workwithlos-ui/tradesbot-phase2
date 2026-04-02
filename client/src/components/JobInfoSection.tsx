import SectionAccordion from "@/components/SectionAccordion";
import { SUPPLIERS, SHINGLE_TYPES, STEEP_PITCH_TIERS, MARKET_CONFIGS } from "@/lib/data";
import { User, MapPin } from "lucide-react";

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
  const hasSteepPitch = Object.values(props.steepPitchSquares).some((v) => v > 0);

  const jobSubtitle = props.customerName
    ? `${props.customerName}${props.address ? " · " + props.address : ""}`
    : "Customer name, address, shingle type";

  return (
    <div className="space-y-3">
      {/* Job Setup — main accordion */}
      <SectionAccordion
        icon={<User className="w-4 h-4" />}
        title="Job Setup"
        subtitle={jobSubtitle}
        defaultOpen={true}
        badge={selectedShingle ? selectedShingle.name.split(" ").slice(0, 2).join(" ") : undefined}
      >
        <div className="space-y-4">
          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Customer</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={props.customerName}
                  onChange={(e) => props.onJobInfoChange("customerName", e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={props.customerPhone}
                  onChange={(e) => props.onJobInfoChange("customerPhone", e.target.value)}
                  className="field-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={props.customerEmail}
                  onChange={(e) => props.onJobInfoChange("customerEmail", e.target.value)}
                  className="field-input"
                />
              </div>
            </div>
          </div>

          {/* Job */}
          <div className="pt-3 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Job Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">Job Name</label>
                <input
                  type="text"
                  placeholder="Smith Residence"
                  value={props.jobName}
                  onChange={(e) => props.onJobInfoChange("jobName", e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, St. Louis, MO"
                  value={props.address}
                  onChange={(e) => props.onJobInfoChange("address", e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Supplier</label>
                <select
                  value={props.supplier}
                  onChange={(e) => props.onSupplierChange(e.target.value)}
                  className="field-select"
                >
                  {SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.isPrimary ? " (Primary)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Shingle Type</label>
                <select
                  value={props.shingleType}
                  onChange={(e) => props.onShingleTypeChange(e.target.value)}
                  className="field-select"
                >
                  <optgroup label="Main (Architectural)">
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
          </div>

          {/* Market */}
          <div className="pt-3 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Market / Location</p>
            <div className="grid grid-cols-2 gap-2">
              {MARKET_CONFIGS.map((market) => (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => props.onMarketChange(market.id)}
                  className={`flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all ${
                    props.market === market.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-sm font-semibold">{market.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">${market.baseLaborRate}/sq base</span>
                </button>
              ))}
            </div>
            {selectedMarket && (
              <p className="text-xs text-muted-foreground mt-2">
                Base labor: <span className="font-medium text-foreground">${selectedMarket.baseLaborRate}/sq</span>
              </p>
            )}
          </div>
        </div>
      </SectionAccordion>

      {/* Roof Pitch — separate collapsible */}
      <SectionAccordion
        icon={<MapPin className="w-4 h-4" />}
        title="Roof Pitch"
        subtitle={hasSteepPitch ? "Steep pitch adder active" : "Standard pitch (4–7), no upcharge"}
        defaultOpen={false}
        badge={hasSteepPitch ? "Adder" : undefined}
      >
        <p className="text-xs text-muted-foreground mb-4">
          Standard 4–7 pitch is included in base labor. Enter squares at steeper pitches for additional charges.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {STEEP_PITCH_TIERS.map((tier) => (
            <div key={tier.id}>
              <label className="field-label">
                {tier.label}
                <span className="text-primary ml-1">+${tier.adderPerSquare}/sq</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={props.steepPitchSquares[tier.id] || ""}
                  onChange={(e) => props.onSteepPitchSquaresChange(tier.id, parseFloat(e.target.value) || 0)}
                  className="num-input pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  sq
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionAccordion>
    </div>
  );
}
