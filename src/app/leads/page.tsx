import LeadList from "@/components/leads/LeadList";
import NewLeadModal from "@/components/leads/LeadModal";
import { getLeads } from "@/lib/api/leads/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Leads() {
  await checkAuth("leads");
  const { leads } = await getLeads();

  return (
    <main className="pt-8 px-14 w-full">
      <div className="flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Leads</h1>
        <NewLeadModal />
      </div>
      <LeadList leads={leads} />
    </main>
  );
}
