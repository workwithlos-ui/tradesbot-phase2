import SectionAccordion from "@/components/SectionAccordion";
import { SUPPLIERS, SHINGLE_TYPES, MARKET_CONFIGS, PITCH_TIERS } from "@/lib/data";
import { User } from "lucide-react";

interface Props {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jobName: string;
  address: string;
  supplier: string;
  shingleType: string;
  market: string;
  pitch: number;
  stories: number;
  onJobInfoChange: (field: string, value: string) => void;
  onSupplierChange: (value: string) => void;
  onShingleTypeChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onPitchChange: (value: number) => void;
  onStoriesChange: (value: number) => void;
}

export default function JobInfoSection(props: Props) {
  const selectedShingle = SHINGLE_TYPES.find((s) => s.id === props.shingleType);
  const selectedMarket = MARKET_CONFIGS.find((m) => m.id === props.market);

  const jobSubtitle = props.customerName
    ? `${props.customerName}${props.address ? " / " + props.address : ""}`
    : "Customer, address, shingle type";

  return (
    <SectionAccordion
      icon={<User className="w-4 h-4" />}
      title="Job Setup"
      subtitle={jobSubtitle}
      defaultOpen={true}
      badge={selectedShingle ? selectedShingle.name.split(" ").slice(0, 2).join(" ") : undefined}
    >
      <div className="space-y-5">
        {/* Customer */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Customer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Name</label>
              <input type="text" placeholder="John Smith" value={props.customerName} onChange={(e) => props.onJobInfoChange("customerName", e.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input type="tel" placeholder="(555) 123-4567" value={props.customerPhone} onChange={(e) => props.onJobInfoChange("customerPhone", e.target.value)} className="field-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Email</label>
              <input type="email" placeholder="john@example.com" value={props.customerEmail} onChange={(e) => props.onJobInfoChange("customerEmail", e.target.value)} className="field-input" />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Job Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Job Name</label>
              <input type="text" placeholder="Smith Residence" value={props.jobName} onChange={(e) => props.onJobInfoChange("jobName", e.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label">Address</label>
              <input type="text" placeholder="123 Main St, St. Louis, MO" value={props.address} onChange={(e) => props.onJobInfoChange("address", e.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label">Supplier</label>
              <select value={props.supplier} onChange={(e) => props.onSupplierChange(e.target.value)} className="field-select">
                {SUPPLIERS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}{s.isPrimary ? " (Primary)" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Shingle Type</label>
              <select value={props.shingleType} onChange={(e) => props.onShingleTypeChange(e.target.value)} className="field-select">
                <optgroup label="Main (Architectural)">
                  {SHINGLE_TYPES.filter((s) => s.category === "architectural").map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.bundlesPerSquare} bndl/sq)</option>
                  ))}
                </optgroup>
                <optgroup label="Budget">
                  {SHINGLE_TYPES.filter((s) => s.category === "budget").map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.bundlesPerSquare} bndl/sq)</option>
                  ))}
                </optgroup>
                <optgroup label="Designer / Premium">
                  {SHINGLE_TYPES.filter((s) => s.category === "designer").map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.bundlesPerSquare} bndl/sq)</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Market */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Market</p>
          <div className="grid grid-cols-2 gap-2">
            {MARKET_CONFIGS.map((market) => {
              const isSelected = props.market === market.id;
              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => props.onMarketChange(market.id)}
                  className="flex flex-col items-start p-3 rounded-lg text-left transition-all"
                  style={{
                    background: isSelected ? "rgba(0,212,170,0.08)" : "var(--background)",
                    border: isSelected ? "1px solid rgba(0,212,170,0.25)" : "1px solid var(--border)",
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: isSelected ? "var(--primary)" : "var(--foreground)" }}>{market.name}</span>
                  <span className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>${market.baseLaborRate}/sq base</span>
                </button>
              );
            })}
          </div>
          {selectedMarket && (
            <p className="text-[11px] mt-2" style={{ color: "var(--muted-foreground)" }}>
              Base labor: <span className="font-medium" style={{ color: "var(--primary)" }}>${selectedMarket.baseLaborRate}/sq</span>
            </p>
          )}
        </div>

        {/* Pitch + Stories */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Roof Pitch & Stories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Pitch</label>
              <select
                className="field-select"
                value={props.pitch}
                onChange={(e) => props.onPitchChange(parseInt(e.target.value))}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(p => {
                  const tier = PITCH_TIERS.find(t => {
                    if (p >= 4 && p <= 7 && t.id === "standard") return true;
                    if (p >= 8 && p <= 9 && t.id === "8-9") return true;
                    if (p >= 10 && p <= 11 && t.id === "10-11") return true;
                    if (p >= 12 && t.id === "12-plus") return true;
                    return false;
                  });
                  const adder = tier?.adderPerSquare || 0;
                  const label = p <= 3 ? `${p}/12 (Low slope / mod bit)` : `${p}/12${adder > 0 ? ` (+$${adder}/sq)` : ""}`;
                  return <option key={p} value={p}>{label}</option>;
                })}
                <option value={99}>Mansard (+$40/sq)</option>
              </select>
              {props.pitch <= 3 && (
                <div className="mt-1.5 text-[11px] px-2 py-1.5 rounded surface-warn" style={{ color: "#FBBF24" }}>
                  Low slope: Modified bitumen will be auto-added to materials
                </div>
              )}
            </div>
            <div>
              <label className="field-label">Stories</label>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => props.onStoriesChange(s)}
                    className="py-3 px-4 rounded-lg text-center transition-all text-sm font-semibold"
                    style={{
                      background: props.stories === s ? "rgba(0,212,170,0.08)" : "var(--background)",
                      border: `1px solid ${props.stories === s ? "rgba(0,212,170,0.25)" : "var(--border)"}`,
                      color: props.stories === s ? "var(--primary)" : "var(--foreground)",
                    }}
                  >
                    {s} Story
                    {s >= 2 && <span className="block text-[10px] font-num" style={{ color: "var(--muted-foreground)" }}>+$10/sq</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
}
