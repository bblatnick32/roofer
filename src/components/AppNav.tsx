"use client";

import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const AppNav = () => {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/leads"
        className={buttonVariants({
          variant: pathname === "/leads" ? "default" : "ghost",
          size: "sm",
        })}
      >
        Leads
      </Link>
      <Link
        href="/opportunities"
        className={buttonVariants({
          variant: pathname === "/opportunities" ? "default" : "ghost",
          size: "sm",
        })}
      >
        Opportunities
      </Link>
      <Link
        href="/projects"
        className={buttonVariants({
          variant: pathname === "/projects" ? "default" : "ghost",
          size: "sm",
        })}
      >
        Projects
      </Link>
    </>
  );
};

export default AppNav;
