"use client";

import * as React from "react";
import { cn, formatDate } from "@/lib/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select departure date",
  helperText,
  error,
  className,
  disabled = false,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(value || "");
  const currentValue = isControlled ? (value ?? "") : internalValue;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formattedDisplay = currentValue
    ? formatDate(new Date(currentValue + "T00:00:00"))
    : "";

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => {
            if (!disabled && inputRef.current) {
              inputRef.current.showPicker?.();
              inputRef.current.focus();
            }
          }}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs cursor-pointer transition-colors",
            "hover:border-slate-400 focus-within:border-brand-navy-900 focus-within:ring-2 focus-within:ring-brand-gold-500/50",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-400 opacity-60",
            error && "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/30"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <CalendarIcon className="h-4 w-4 text-brand-navy-800 shrink-0" />
            <span
              className={cn(
                "truncate",
                !currentValue && "text-slate-400"
              )}
            >
              {formattedDisplay || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear date"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Hidden Native Date Input for Accessibility & Mobile Date Pickers */}
        <input
          ref={inputRef}
          type="date"
          value={currentValue}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
          tabIndex={-1}
        />
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
