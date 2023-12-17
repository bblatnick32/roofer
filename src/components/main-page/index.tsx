import { PropsWithChildren } from "react";

export function MainPageWrapper({ children }: PropsWithChildren) {
  return <main className="pt-8 px-14 w-full">{children}</main>;
}

export function MainPageHeader({ children }: PropsWithChildren) {
  return <h1 className="font-semibold text-2xl my-2">{children}</h1>;
}
