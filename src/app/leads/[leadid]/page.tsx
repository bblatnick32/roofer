import { checkAuth } from "@/lib/auth/utils";

interface PageProps {
  params: {
    leadid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { leadid } = params;
  await checkAuth(`leads/${leadid}`);

  // make a call to get the lead
  // const { lead } = await getLeadById(Number(leadid));
  // if (!lead) notFound();

  // return <LeadDetails lead={lead} />;
  return null;
};

export default Page;
