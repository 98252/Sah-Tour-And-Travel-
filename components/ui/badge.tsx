import * as React from "react";
import { cn } from "@/lib/utils";
import { type BadgeVariant } from "@/types";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  showIcon?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-brand-navy-900 text-white shadow-sm",
  verified:
    "border-brand-emerald-600/30 bg-brand-emerald-50 text-brand-emerald-700 font-semibold shadow-xs",
  luxury:
    "border-brand-gold-500/30 bg-brand-gold-50 text-brand-gold-700 font-semibold shadow-xs",
  teal:
    "border-brand-teal-600/30 bg-brand-teal-50 text-brand-teal-700 font-medium",
  outline:
    "border-slate-300 text-slate-700 bg-white shadow-xs",
  destructive:
    "border-transparent bg-rose-100 text-rose-700 font-medium",
  warning:
    "border-amber-300 bg-amber-50 text-amber-800 font-medium",
  subtle:
    "border-transparent bg-slate-100 text-slate-700 font-medium",
};

export function Badge({
  className,
  variant = "default",
  showIcon = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:ring-offset-2",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {showIcon && variant === "verified" && (
        <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald-600 shrink-0" />
      )}
      {showIcon && variant === "luxury" && (
        <Sparkles className="h-3.5 w-3.5 text-brand-gold-600 shrink-0" />
      )}
      {showIcon && variant === "default" && (
        <CheckCircle2 className="h-3.5 w-3.5 text-brand-gold-400 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}
