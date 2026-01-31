"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedCellProps {
  value: string | number;
  maxWidth?: string;
  className?: string;
}

export function TruncatedCell({ value, maxWidth = "200px", className }: TruncatedCellProps) {
  const [open, setOpen] = useState(false);
  const displayValue = String(value);
  
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <div
          className={cn("truncate cursor-pointer", className)}
          style={{ maxWidth }}
          onClick={() => setOpen((prev) => !prev)}
        >
          {displayValue}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[400px]">
        {displayValue}
      </TooltipContent>
    </Tooltip>
  );
}
