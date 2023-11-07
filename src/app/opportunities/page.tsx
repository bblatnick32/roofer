import OpportunityList from "@/components/opportunities/OpportunityList";
import NewOpportunityModal from "@/components/opportunities/OpportunityModal";
import { getOpportunities } from "@/lib/api/opportunities/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Opportunities() {
  await checkAuth("opportunities");
  const { opportunities } = await getOpportunities();

  return (
    <main className="mx-20 max-w-7xl w-full md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Opportunities</h1>
        <NewOpportunityModal />
      </div>
      <OpportunityList opportunities={opportunities} />
    </main>
  );
}
