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
    <div className="flex flex-col w-full gap-4">
      <MainPageWrapper className="flex flex-col gap-4">
        <div className="flex w-full">
          <div className="mr-4">
            <h1 className="text-sm text-gray-500">Opportunity</h1>
            <h1 className="font-bold text-2xl text-gray-900">{opp.name}</h1>
          </div>
          <OppStagePipeline opp={opp} />
        </div>
        <OppStatusToolbar opp={opp} />
        <OppNav opp={opp} />
      </MainPageWrapper>
      <div className="flex justify-between h-full mx-14 rounded-[0.5rem] border">
        {children}
      </div>
    </div>
  );
};

export default OppWrapper;
