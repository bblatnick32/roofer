import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function MainPageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn("pt-8 px-14 w-full", className)}>{children}</main>;
}

export function MainPageHeader({ children }: PropsWithChildren) {
  return <h1 className="font-semibold text-2xl my-2">{children}</h1>;
}
