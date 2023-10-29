import LeadList from "@/components/leads/LeadList";
import NewLeadModal from "@/components/leads/LeadModal";
import { getLeads } from "@/lib/api/leads/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Leads() {
  await checkAuth("leads");
  const { leads } = await getLeads();

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Leads</h1>
        <NewLeadModal />
      </div>
      <LeadList leads={leads} />
    </main>
  );
}
