import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface SectionAccordionProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
}

export default function SectionAccordion({
  icon,
  title,
  subtitle,
  rightContent,
  defaultOpen = false,
  children,
  badge,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="section-card">
      <button
        className="section-header w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,212,170,0.08)", color: "var(--primary)" }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{title}</span>
              {badge && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ background: "rgba(0,212,170,0.1)", color: "var(--primary)" }}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {rightContent && (
            <div className="text-right">{rightContent}</div>
          )}
          <ChevronRight
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: "var(--muted-foreground)",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="accordion-content px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
