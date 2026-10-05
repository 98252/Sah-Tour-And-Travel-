import * as React from "react";
import { cn } from "@/lib/utils";
import { type ButtonVariant, type ButtonSize } from "@/types";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | "teal";
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-brand-navy-900 text-white hover:bg-brand-navy-800 active:bg-brand-navy-950 shadow-luxury-sm hover:shadow-luxury-md border border-brand-navy-800",
  luxury:
    "bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-500 text-brand-navy-950 font-semibold hover:from-brand-gold-400 hover:to-brand-gold-300 shadow-luxury-sm hover:shadow-luxury-md border border-brand-gold-400",
  teal:
    "bg-brand-teal-600 text-white hover:bg-brand-teal-700 active:bg-brand-teal-800 shadow-luxury-sm",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-sm",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  link:
    "bg-transparent text-brand-gold-600 hover:text-brand-gold-700 underline-offset-4 hover:underline p-0 h-auto font-medium",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
  xl: "h-14 px-8 text-lg rounded-xl gap-3",
  icon: "h-10 w-10 p-0 rounded-lg justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none",
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
