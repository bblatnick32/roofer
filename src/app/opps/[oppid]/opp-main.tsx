import { CompleteOpp } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import OppStagePipeline from "./opp-stage-pipeline";
import OppStatus from "./opp-status";
import PageSection from "@/components/ui/page-section";
import OppOverview from "./opp-overview";

const OppMain = ({ opp }: { opp: CompleteOpp }) => {
  return (
    <div className="flex flex-col w-full gap-8">
      <MainPageWrapper className="flex flex-col gap-8">
        <div className="flex w-full">
          <div className="mr-4">
            <h1 className="text-sm text-gray-500">Opportunity</h1>
            <h1 className="font-bold text-2xl text-gray-900">{opp.name}</h1>
          </div>
          <OppStagePipeline opp={opp} />
        </div>
        <OppStatus opp={opp} />
      </MainPageWrapper>
      <PageSection>
        <OppOverview opp={opp} />
      </PageSection>
    </div>
  );
};

export default OppMain;
