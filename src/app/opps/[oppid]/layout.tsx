import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import { getOppById } from "@/lib/api/opps/queries";
import OppWrapper from "./opp-wrapper";

interface OppLayoutProps {
  params: {
    oppid: string;
  };
  children: React.ReactNode;
}

const OppLayout = async ({ params, children }: OppLayoutProps) => {
  const { oppid } = params;
  await checkAuth(`opps/${oppid}`);

  // make a call to get the opp
  const { opp } = await getOppById(Number(oppid));
  if (!opp) notFound();

  return <OppWrapper opp={opp}>{children}</OppWrapper>;
};

export default OppLayout;
