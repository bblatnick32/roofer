import MainPageWrapper from "@/components/main-page-wrapper";
import OpportunityList from "@/components/opportunities/OpportunityList";
import NewOpportunityModal from "@/components/opportunities/OpportunityModal";
import { getLeads } from "@/lib/api/leads/queries";
import { getOpportunities } from "@/lib/api/opportunities/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Opportunities() {
  await checkAuth("opportunities");
  const { opportunities } = await getOpportunities();
  const { leads } = await getLeads();

  return (
    <MainPageWrapper>
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Opportunities</h1>
        <NewOpportunityModal leads={leads} />
      </div>
      <OpportunityList opportunities={opportunities} leads={leads} />
    </MainPageWrapper>
  );
}
