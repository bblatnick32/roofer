import OppForm from "@/components/opps/OppForm";
import { getOppById } from "@/lib/api/opps/queries";
import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";

interface OppLayoutProps {
  params: {
    oppid: string;
  };
}

const OppDetailPage = async ({ params }: OppLayoutProps) => {
  const { oppid } = params;
  await checkAuth(`opps/${oppid}/detail`);

  // make a call to get the opp
  const { opp } = await getOppById(Number(oppid));
  if (!opp) notFound();

  return <OppForm opp={opp} />;
};

export default OppDetailPage;
