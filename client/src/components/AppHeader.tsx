import { Link } from "wouter";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border" style={{ background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div className="container flex items-center justify-between h-12">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
              <path d="M17.64 15L22 10.64" />
              <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--foreground)" }}>Shingles.ai</span>
            <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>Roofing Estimator</span>
          </div>
        </div>
        <Link
          href="/estimates"
          className="text-xs font-medium transition-colors"
          style={{ color: "var(--muted-foreground)" }}
        >
          Saved
        </Link>
      </div>
    </header>
  );
}
