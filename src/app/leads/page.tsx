import LeadList from "@/components/leads/LeadList";
import NewLeadModal from "@/components/leads/LeadModal";
import { MainPageWrapper } from "@/components/main-page";
import { api } from "@/lib/trpc/api";

export default async function Leads() {
  const { leads } = await api.jobs.getLeads.query();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Leads</h1>
        <NewLeadModal />
      </div>
      <LeadList leads={leads} />
    </MainPageWrapper>
  );
}
