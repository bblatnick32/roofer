"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Opp } from "@/lib/db";
import { usePathname } from "next/navigation";

export default function OppNav({
  className,
  opp,
}: {
  className?: string;
  opp: Opp;
}) {
  const pathname = usePathname();
  const tabs = [
    {
      name: "Overview",
      href: `/opps/${opp.id}`,
    },
  ];

  return (
    <nav className={cn("flex items-center", className)}>
      {tabs.map((tab, index) => (
        <Link
          href={tab.href}
          key={tab.href}
          className={cn(
            "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
            pathname?.startsWith(tab.href) || (index === 0 && pathname === "/")
              ? "bg-muted font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
