import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

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
          <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{title}</span>
              {badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {rightContent && (
            <div className="text-right">{rightContent}</div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="accordion-content border-t border-border/60 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
