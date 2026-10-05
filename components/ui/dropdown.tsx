"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | { separator: true })[];
  align?: "left" | "right" | "center";
  width?: "auto" | "sm" | "md" | "lg";
  className?: string;
}

const widthStyles = {
  auto: "w-auto min-w-[12rem]",
  sm: "w-48",
  md: "w-64",
  lg: "w-80",
};

const alignStyles = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
};

export function Dropdown({
  trigger,
  items,
  align = "right",
  width = "auto",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="cursor-pointer focus:outline-none"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute z-50 mt-2 origin-top rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-luxury-lg",
            "animate-in fade-in zoom-in-95 duration-150",
            widthStyles[width],
            alignStyles[align],
            className
          )}
        >
          {items.map((item, index) => {
            if ("separator" in item) {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-slate-100"
                />
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  "hover:bg-slate-50 focus:bg-slate-50 focus:outline-none",
                  item.danger
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-700 hover:text-brand-navy-950",
                  item.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && (
                    <span className="text-slate-400 shrink-0">{item.icon}</span>
                  )}
                  <div>
                    <span className="font-medium">{item.label}</span>
                    {item.description && (
                      <p className="text-xs text-slate-400 font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <span className="ml-2 rounded-full bg-brand-gold-50 px-2 py-0.5 text-[10px] font-semibold text-brand-gold-700 border border-brand-gold-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
