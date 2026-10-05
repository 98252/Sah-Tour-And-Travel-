"use client";

import * as React from "react";
import { ALargeSmall, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FontSizeOption = "normal" | "large" | "extra-large";

interface FontSizeAdjusterProps {
  className?: string;
  variant?: "header" | "floating" | "inline";
}

export function FontSizeAdjuster({ className, variant = "header" }: FontSizeAdjusterProps) {
  const [currentSize, setCurrentSize] = React.useState<FontSizeOption>("normal");
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("sah_font_size") as FontSizeOption | null;
      if (saved && (saved === "normal" || saved === "large" || saved === "extra-large")) {
        setCurrentSize(saved);
        document.documentElement.setAttribute("data-font-size", saved);
      }
    } catch {
      // Ignore localStorage failures in private mode
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const setFontSize = (size: FontSizeOption) => {
    setCurrentSize(size);
    try {
      localStorage.setItem("sah_font_size", size);
    } catch {
      // Ignore
    }
    document.documentElement.setAttribute("data-font-size", size);
    setIsOpen(false);
  };

  const options: { id: FontSizeOption; label: string; badge: string; scale: string }[] = [
    { id: "normal", label: "Default", badge: "A", scale: "Standard" },
    { id: "large", label: "Large", badge: "A+", scale: "+15% Bigger" },
    { id: "extra-large", label: "Extra Large", badge: "A++", scale: "+30% High Visibility" },
  ];

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200", className)}>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <ALargeSmall className="w-4 h-4 text-brand-gold-600" />
            Display Font Size
          </span>
          <span className="text-[11px] font-bold text-brand-gold-700 bg-brand-gold-100 px-2 py-0.5 rounded-full">
            {options.find((o) => o.id === currentSize)?.scale}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFontSize(opt.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                currentSize === opt.id
                  ? "bg-brand-navy-900 border-brand-navy-900 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              )}
            >
              <span className="text-sm font-bold tracking-tight">{opt.badge}</span>
              <span className="text-[11px] opacity-80">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Adjust Font Size / Text Visibility"
        title="Adjust text size for better readability"
        className={cn(
          "relative flex items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs",
          variant === "header"
            ? "h-10 px-2.5 sm:px-3 gap-1.5 border-slate-200/80 bg-white text-slate-700 hover:border-brand-gold-500/40 hover:bg-slate-50 hover:text-brand-navy-900"
            : "h-11 px-3.5 gap-2 border-slate-300 bg-white/95 backdrop-blur-md text-slate-800 shadow-luxury-md hover:border-brand-gold-500"
        )}
      >
        <ALargeSmall className="h-4 w-4 text-brand-gold-600" />
        <span className="text-xs font-bold tracking-wider text-slate-800">
          {options.find((o) => o.id === currentSize)?.badge}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ALargeSmall className="w-4 h-4 text-brand-gold-600" />
              Text Visibility & Size
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            Choose comfortable reading size across all pages and packages:
          </p>

          <div className="space-y-1.5">
            {options.map((opt) => {
              const isSelected = currentSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize(opt.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer border",
                    isSelected
                      ? "bg-brand-navy-900 text-white border-brand-navy-900 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs",
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-800"
                      )}
                    >
                      {opt.badge}
                    </span>
                    <div>
                      <div className="text-xs font-bold leading-tight">{opt.label}</div>
                      <div
                        className={cn(
                          "text-[10px]",
                          isSelected ? "text-slate-300" : "text-slate-500"
                        )}
                      >
                        {opt.scale}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-gold-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
