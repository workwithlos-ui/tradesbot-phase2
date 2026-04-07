import SectionAccordion from "@/components/SectionAccordion";
import { VENT_OPTIONS, WASTE_FACTOR_MIN, WASTE_FACTOR_MAX, getTotalSquares } from "@/lib/data";
import type { RoofMeasurements, CalculatedMaterials } from "@/lib/data";
import { Ruler, ChevronDown } from "lucide-react";

interface Props {
  measurements: RoofMeasurements;
  wasteFactor: number;
  calculatedMaterials: CalculatedMaterials;
  shingleBundlesPerSq: number;
  onMeasurementChange: (field: keyof RoofMeasurements, value: number | string | boolean) => void;
  onWasteFactorChange: (value: number) => void;
}

function NumField({ label, suffix, value, onChange, placeholder, min }: {
  label: string; suffix?: string; value: number; onChange: (v: number) => void; placeholder?: string; min?: number;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min ?? 0}
          step="1"
          placeholder={placeholder || "0"}
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="num-input"
          style={suffix ? { paddingRight: "2.5rem" } : {}}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none" style={{ color: "var(--muted-foreground)" }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default function RoofMeasurementsSection(props: Props) {
  const { measurements: m, calculatedMaterials: calc, wasteFactor } = props;
  const exhaustOptions = VENT_OPTIONS.filter(v => v.type === "exhaust");
  const intakeOptions = VENT_OPTIONS.filter(v => v.type === "intake");

  const totalSq = getTotalSquares(m);
  const baseBundles = calc.shingleBundlesBase;
  const withWaste = calc.shingleBundles;

  const subtitle = totalSq > 0
    ? `${totalSq} sq / ${withWaste} bundles (${wasteFactor}% waste)`
    : "Enter roof dimensions";

  return (
    <SectionAccordion
      icon={<Ruler className="w-4 h-4" />}
      title="Roof Measurements"
      subtitle={subtitle}
      defaultOpen={true}
      badge={totalSq > 0 ? `${totalSq} SQ` : undefined}
    >
      <div className="space-y-5">
        {/* Multi-Pitch Squares */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>Squares by Pitch</p>
          <p className="text-[10px] mb-3" style={{ color: "var(--muted-foreground)" }}>
            Enter squares at each pitch range. Base rate (4-7) has no adder. Steep pitches add labor.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <NumField label="4-7 Pitch (Base)" suffix="SQ" value={m.pitchBaseSq} onChange={v => props.onMeasurementChange("pitchBaseSq", v)} />
            <NumField label="8-9 Pitch (+$10/sq)" suffix="SQ" value={m.pitch89Sq} onChange={v => props.onMeasurementChange("pitch89Sq", v)} />
            <NumField label="10-11 Pitch (+$20/sq)" suffix="SQ" value={m.pitch1011Sq} onChange={v => props.onMeasurementChange("pitch1011Sq", v)} />
            <NumField label="12+ Pitch (+$30/sq)" suffix="SQ" value={m.pitch12PlusSq} onChange={v => props.onMeasurementChange("pitch12PlusSq", v)} />
            <NumField label="Mansard (+$40/sq)" suffix="SQ" value={m.pitchMansardSq} onChange={v => props.onMeasurementChange("pitchMansardSq", v)} />
          </div>
          {totalSq > 0 && (
            <div className="mt-3 p-3 rounded-lg surface-highlight">
              <div className="flex items-center justify-between text-[12px]">
                <span style={{ color: "var(--muted-foreground)" }}>
                  Total: {totalSq} SQ x {props.shingleBundlesPerSq} bndl/sq = {baseBundles} base
                </span>
                <span className="font-num font-semibold" style={{ color: "var(--primary)" }}>
                  {withWaste} bundles
                </span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                +{withWaste - baseBundles} bundles for {wasteFactor}% waste
              </div>
            </div>
          )}
        </div>

        {/* Waste Factor */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Waste Factor</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={WASTE_FACTOR_MIN}
              max={WASTE_FACTOR_MAX}
              step={1}
              value={wasteFactor}
              onChange={e => props.onWasteFactorChange(parseInt(e.target.value))}
              className="flex-1"
              style={{ accentColor: "var(--primary)", height: "44px" }}
            />
            <span className="font-num text-sm font-semibold w-10 text-right" style={{ color: "var(--primary)" }}>{wasteFactor}%</span>
          </div>
        </div>

        {/* Stories */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Building</p>
          <div className="grid grid-cols-2 gap-2">
            {([1, 2] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => props.onMeasurementChange("stories", s)}
                className="py-3 px-4 rounded-lg text-center transition-all text-sm font-semibold"
                style={{
                  background: m.stories === s ? "rgba(0,212,170,0.08)" : "var(--background)",
                  border: `1px solid ${m.stories === s ? "rgba(0,212,170,0.25)" : "var(--border)"}`,
                  color: m.stories === s ? "var(--primary)" : "var(--foreground)",
                }}
              >
                {s} Story
                {s === 2 && <span className="block text-[10px]" style={{ color: "var(--muted-foreground)" }}>+$10/sq labor</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Linear Feet */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Linear Feet</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <NumField label="Eaves" suffix="LF" value={m.eavesLf} onChange={v => props.onMeasurementChange("eavesLf", v)} />
            <NumField label="Ridge" suffix="LF" value={m.ridgeLf} onChange={v => props.onMeasurementChange("ridgeLf", v)} />
            <NumField label="Hips" suffix="LF" value={m.hipsLf} onChange={v => props.onMeasurementChange("hipsLf", v)} />
            <NumField label="Valleys" suffix="LF" value={m.valleysLf} onChange={v => props.onMeasurementChange("valleysLf", v)} />
            <NumField label="Rakes" suffix="LF" value={m.rakesLf} onChange={v => props.onMeasurementChange("rakesLf", v)} />
            <NumField label="Step Flashing" suffix="LF" value={m.stepFlashingLf} onChange={v => props.onMeasurementChange("stepFlashingLf", v)} />
            <NumField label="Wall Flashing" suffix="LF" value={m.wallFlashingLf} onChange={v => props.onMeasurementChange("wallFlashingLf", v)} />
          </div>
        </div>

        {/* Hip & Ridge Profile */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Hip & Ridge Profile</p>
          <div className="grid grid-cols-2 gap-2">
            {(["standard", "high-profile"] as const).map(profile => (
              <button
                key={profile}
                type="button"
                onClick={() => props.onMeasurementChange("hipRidgeProfile", profile)}
                className="py-3 px-4 rounded-lg text-center transition-all text-sm font-semibold capitalize"
                style={{
                  background: m.hipRidgeProfile === profile ? "rgba(0,212,170,0.08)" : "var(--background)",
                  border: `1px solid ${m.hipRidgeProfile === profile ? "rgba(0,212,170,0.25)" : "var(--border)"}`,
                  color: m.hipRidgeProfile === profile ? "var(--primary)" : "var(--foreground)",
                }}
              >
                {profile === "standard" ? "Standard" : "High Profile"}
                <span className="block text-[10px] font-num" style={{ color: "var(--muted-foreground)" }}>
                  {profile === "standard" ? "31 LF/bndl" : "20 LF/bndl"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Penetrations */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Penetrations & Accessories</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <NumField label="Chimneys" value={m.chimneyCount} onChange={v => props.onMeasurementChange("chimneyCount", v)} />
            <NumField label="Skylights" value={m.skylightCount} onChange={v => props.onMeasurementChange("skylightCount", v)} />
            <div>
              <label className="field-label">Skylight Type</label>
              <select
                className="field-select"
                value={m.skylightType}
                onChange={e => props.onMeasurementChange("skylightType", e.target.value)}
              >
                <option value="curb-mount">Curb Mount</option>
                <option value="deck-mount">Deck Mount</option>
              </select>
            </div>
            <NumField label="Pipe Jacks" value={m.pipeJackCount} onChange={v => props.onMeasurementChange("pipeJackCount", v)} />
            <NumField label="Split Boots" value={m.splitBootCount} onChange={v => props.onMeasurementChange("splitBootCount", v)} />
            <NumField label="EZ Plugs" value={m.ezPlugCount} onChange={v => props.onMeasurementChange("ezPlugCount", v)} />
            <NumField label="Broan Vents" value={m.bathroomVentCount} onChange={v => props.onMeasurementChange("bathroomVentCount", v)} />
          </div>
        </div>

        {/* Ventilation */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Ventilation</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Exhaust Type (choose one)</label>
              <select
                className="field-select"
                value={m.exhaustVentType}
                onChange={e => props.onMeasurementChange("exhaustVentType", e.target.value)}
              >
                <option value="">None</option>
                {exhaustOptions.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (${v.unitPrice}/{v.unit})</option>
                ))}
              </select>
            </div>
            {m.exhaustVentType && (
              <NumField label="Exhaust Qty" value={m.exhaustVentQty} onChange={v => props.onMeasurementChange("exhaustVentQty", v)} />
            )}
            <div>
              <label className="field-label">Intake Type</label>
              <select
                className="field-select"
                value={m.intakeVentType}
                onChange={e => props.onMeasurementChange("intakeVentType", e.target.value)}
              >
                <option value="">None</option>
                {intakeOptions.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (${v.unitPrice}/{v.unit})</option>
                ))}
              </select>
            </div>
            {m.intakeVentType && (
              <NumField label="Intake Qty" value={m.intakeVentQty} onChange={v => props.onMeasurementChange("intakeVentQty", v)} />
            )}
          </div>
        </div>

        {/* Decking */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Decking</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Decking Action</label>
              <select
                className="field-select"
                value={m.deckingAction}
                onChange={e => props.onMeasurementChange("deckingAction", e.target.value)}
              >
                <option value="none">No decking work</option>
                <option value="tear-off">Remove + Replace</option>
                <option value="overlay">Overlay (install over existing)</option>
              </select>
            </div>
            {m.deckingAction !== "none" && (
              <NumField
                label="Sheets Override (0 = auto)"
                suffix="sheets"
                value={m.deckingSheetsOverride}
                onChange={v => props.onMeasurementChange("deckingSheetsOverride", v)}
              />
            )}
          </div>
          {m.deckingAction !== "none" && calc.deckingSheets > 0 && (
            <div className="mt-2 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              Calculated: {calc.deckingSheets} sheets of 4x8 OSB
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Conditions</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { field: "shakeTearoff" as const, label: "Cedar Shake Tearoff", desc: "+$15/sq" },
              { field: "handLoad" as const, label: "Hand Load", desc: "+$5/sq" },
              { field: "noDumpsterAccess" as const, label: "No Dumpster Access", desc: "Drag trash charge" },
            ]).map(({ field, label, desc }) => (
              <button
                key={field}
                type="button"
                onClick={() => props.onMeasurementChange(field, !m[field])}
                className="py-3 px-4 rounded-lg text-left transition-all"
                style={{
                  background: m[field] ? "rgba(0,212,170,0.08)" : "var(--background)",
                  border: `1px solid ${m[field] ? "rgba(0,212,170,0.25)" : "var(--border)"}`,
                }}
              >
                <span className="text-sm font-semibold" style={{ color: m[field] ? "var(--primary)" : "var(--foreground)" }}>{label}</span>
                <span className="block text-[10px]" style={{ color: "var(--muted-foreground)" }}>{desc}</span>
              </button>
            ))}
          </div>
          <div className="mt-3">
            <NumField label="Additional Layers (extra shingle/felt layers to tear off)" value={m.additionalLayers} onChange={v => props.onMeasurementChange("additionalLayers", v)} />
          </div>
        </div>

        {/* Caulk + Paint */}
        <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Consumables</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Caulk Tubes" value={m.caulkTubes} onChange={v => props.onMeasurementChange("caulkTubes", v)} />
            <NumField label="Spray Paint Cans" value={m.sprayPaintCans} onChange={v => props.onMeasurementChange("sprayPaintCans", v)} />
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
}