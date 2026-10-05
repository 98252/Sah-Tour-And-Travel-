"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function VoucherPrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handlePrint}
      leftIcon={<Printer className="h-3.5 w-3.5 text-slate-600" />}
      className="text-xs"
    >
      Print / Download Voucher
    </Button>
  );
}
