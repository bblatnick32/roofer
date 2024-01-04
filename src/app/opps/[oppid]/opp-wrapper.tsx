import { CompleteOpp } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import OppStagePipeline from "./opp-stage-pipeline";
import OppNav from "./opp-nav";
import OppStatusToolbar from "./opp-status-toolbar";

const OppWrapper = ({
  opp,
  children,
}: {
  opp: CompleteOpp;
  children: React.ReactNode;
}) => {
  return (
    <MainPageWrapper className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="mr-4">
          <h1 className="text-md text-gray-500">Opportunity</h1>
          <h1 className="font-bold text-5xl text-gray-900">{opp.name}</h1>
        </div>
        <OppStagePipeline opp={opp} />
      </div>
      <div className="flex justify-between">
        <OppNav className="pt-2" opp={opp} />
        <OppStatusToolbar opp={opp} />
      </div>
      {children}
    </MainPageWrapper>
  );
};

export default OppWrapper;
