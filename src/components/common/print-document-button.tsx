"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintDocumentButtonProps {
  label?: string;
  className?: string;
}

export function PrintDocumentButton({
  label = "Print Document",
  className,
}: PrintDocumentButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className={className}
    >
      <Printer className="h-3.5 w-3.5 mr-1.5" />
      <span>{label}</span>
    </Button>
  );
}

