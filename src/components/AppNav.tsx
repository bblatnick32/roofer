"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AppNav = () => {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/leads"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/leads" ? "text-foreground" : "text-foreground/60"
        )}
      >
        Leads
      </Link>
      <Link
        href="/opportunities"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/opportunities"
            ? "text-foreground"
            : "text-foreground/60"
        )}
      >
        Opportunities
      </Link>
      <Link
        href="/projects"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/projects" ? "text-foreground" : "text-foreground/60"
        )}
      >
        Projects
      </Link>
    </>
  );
};

export default AppNav;
