import { PropsWithChildren } from "react";

export default function MainPageWrapper({ children }: PropsWithChildren) {
  return <main className="pt-8 px-14 w-full">{children}</main>;
}
