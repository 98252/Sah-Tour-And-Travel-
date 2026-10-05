import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  statusCode?: number | string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something Went Wrong",
  message = "We encountered a temporary issue while retrieving travel data. Please try again or return to the homepage.",
  statusCode,
  onRetry,
  showHomeButton = true,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/40 p-10 text-center shadow-xs",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-xs">
        <AlertTriangle className="h-8 w-8" />
      </div>

      {statusCode && (
        <span className="text-xs font-bold tracking-widest text-rose-500 uppercase mb-1">
          Error {statusCode}
        </span>
      )}

      <h3 className="font-heading text-xl font-bold text-brand-navy-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="default"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        )}

        {showHomeButton && (
          <Link href="/">
            <Button
              variant="outline"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go to Homepage
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export interface ErrorAlertProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorAlert({ title, message, className }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900",
        className
      )}
    >
      <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className="text-xs text-rose-700 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
