import { MainPageHeader, MainPageWrapper } from "@/components/main-page";
import { checkAuth } from "@/lib/auth/utils";

export default async function Opportunities() {
  await checkAuth("opportunities");
  // const { opportunities } = await getOpportunities();

  return (
    <MainPageWrapper>
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <MainPageHeader>Opportunities</MainPageHeader>
        {/* <NewOpportunityModal /> */}
      </div>
      {/* <OpportunityList opportunities={opportunities} /> */}
    </MainPageWrapper>
  );
}
