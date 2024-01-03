"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Job, JobStages } from "@/lib/db";
import { usePathname } from "next/navigation";

export default function JobNav({
  className,
  job,
}: {
  className?: string;
  job: Job;
}) {
  const pathname = usePathname();
  const tabs = [
    {
      name: "Detail",
      href: `/jobs/${job.id}/detail`,
    },
  ];

  if (job.stage !== JobStages.LEAD) {
    tabs.push({
      name: "Inspection",
      href: `/jobs/${job.id}/inspection`,
    });
  }

  if (job.stage !== JobStages.LEAD && job.stage !== JobStages.INSPECTION) {
    tabs.push({
      name: "Proposal",
      href: `/jobs/${job.id}/proposal`,
    });
  }

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
