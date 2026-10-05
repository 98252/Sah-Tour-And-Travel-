import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { type BreadcrumbItem } from "@/types";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({
  items,
  showHome = true,
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-slate-500", className)}
    >
      <ol
        className="flex items-center space-x-1.5 sm:space-x-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {showHome && (
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            <Link
              href="/"
              itemProp="item"
              className="flex items-center text-slate-400 hover:text-brand-navy-900 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only" itemProp="name">
                Home
              </span>
            </Link>
            <meta itemProp="position" content="1" />
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-1 shrink-0" />
          </li>
        )}

        {items.map((item, index) => {
          const position = (showHome ? 2 : 1) + index;
          const isLast = index === items.length - 1 || item.isCurrent;

          return (
            <li
              key={item.label}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              {isLast || !item.href ? (
                <span
                  itemProp="name"
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-brand-navy-900 truncate max-w-[200px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  itemProp="item"
                  className="hover:text-brand-navy-900 transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(position)} />

              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-1 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
