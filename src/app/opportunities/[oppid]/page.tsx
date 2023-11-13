import { getOpportunityById } from "@/lib/api/opportunities/queries";
import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import OpportunityDetails from "./opportunity-details";

interface PageProps {
  params: {
    oppid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { oppid } = params;

  await checkAuth(`opportunities/${oppid}`);

  // make a call to get the opportunity
  const { opportunity } = await getOpportunityById(Number(oppid));

  if (!opportunity) notFound();

  return <OpportunityDetails opportunity={opportunity} />;
};

export default Page;
