import { checkAuth } from "@/lib/auth/utils";
import { MainPageWrapper, MainPageHeader } from "@/components/main-page";
import { getLeads } from "@/lib/api/jobs/queries";
import NewLeadModal from "@/components/leads/LeadModal";
import LeadList from "@/components/leads/LeadList";

export default async function Leads() {
  await checkAuth("leads");
  const { leads } = await getLeads();

  return (
    <MainPageWrapper>
      <div className="flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <MainPageHeader>Leads</MainPageHeader>
        <NewLeadModal />
      </div>
      <LeadList leads={leads} />
    </MainPageWrapper>
  );
}
