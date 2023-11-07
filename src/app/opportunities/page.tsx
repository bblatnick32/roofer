import OpportunitieList from "@/components/opportunities/OpportunitieList";
import NewOpportunitieModal from "@/components/opportunities/OpportunitieModal";
import { getOpportunities } from "@/lib/api/opportunities/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Opportunities() {
  await checkAuth();
  const { opportunities } = await getOpportunities();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Opportunities</h1>
        <NewOpportunitieModal />
      </div>
      <OpportunitieList opportunities={opportunities} />
    </main>
  );
}
