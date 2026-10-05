"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  className = "",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return (
      <div className={`flex items-center justify-between text-xs text-slate-500 py-3 ${className}`}>
        <span>
          Showing <strong>{totalCount}</strong> verified {totalCount === 1 ? "package" : "packages"}
        </span>
      </div>
    );
  }

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    } else {
      params.delete("page");
    }
    return `${pathname}?${params.toString()}`;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers to display
  const pages: (number | "dots")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("dots");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("dots");
    pages.push(totalPages);
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200/80 ${className}`}
    >
      <div className="text-xs text-slate-500">
        Showing <strong className="text-brand-navy-900">{startItem}</strong> to{" "}
        <strong className="text-brand-navy-900">{endItem}</strong> of{" "}
        <strong className="text-brand-navy-900">{totalCount}</strong> verified packages
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs text-slate-600 hover:text-brand-navy-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 px-2.5 text-xs text-slate-300 border-slate-100 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
        )}

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "dots") {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return isCurrent ? (
              <span
                key={p}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-500 font-heading text-xs font-bold text-white shadow-sm"
              >
                {p}
              </span>
            ) : (
              <Link key={p} href={createPageUrl(p)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  {p}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs text-slate-600 hover:text-brand-navy-900"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 px-2.5 text-xs text-slate-300 border-slate-100 cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
