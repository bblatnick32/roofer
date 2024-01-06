"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Stage = ({
  className,
  children,
  isLast = false,
  isFirst = false,
  variant,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  isLast?: boolean;
  isFirst?: boolean;
  variant?: "default" | "outline" | "secondary";
  onClick?: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={cn(
        className,
        "w-full relative h-8",
        !isFirst &&
          "rounded-l-none before:border-l-white before:absolute before:left-[-16px] before:top-1/2 before:border-t-[16px] before:border-t-transparent before:border-b-[16px] before:border-b-transparent before:border-l-[16px] before:translate-x-full before:-translate-y-1/2 before:z-9 before:transition-colors",
        !isLast &&
          "rounded-r-none after:absolute after:right-0 after:top-1/2 after:border-t-[16px] after:border-t-transparent after:border-b-[16px] after:border-b-transparent after:border-l-[16px] after:translate-x-full after:-translate-y-1/2 after:z-10 after:transition-colors",
        !isFirst && !isLast && "pr-0 pl-6",
        isFirst && "pb-[0.25rem]"
      )}
    >
      <span className={cn("truncate", isFirst && "mb-[0.25rem]")}>
        {children}
      </span>
    </Button>
  );
};

export default Stage;
