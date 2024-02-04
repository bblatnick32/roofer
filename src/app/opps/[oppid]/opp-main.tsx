import { CompleteOpp } from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import OppStagePipeline from "./opp-stage-pipeline";
import OppStageChecklist from "./opp-status";
import PageSection from "@/components/ui/page-section";
import OppOverview from "./opp-overview";
import DeleteOppMenuItem from "@/components/opps/delete-opp-menu-item";
import ThreeDotsButton from "@/components/ui/three-dots-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

const OppMain = ({ opp }: { opp: CompleteOpp }) => {
  return (
    <MainPageWrapper className="flex flex-col gap-8">
      <div className="flex w-full gap-4">
        <div>
          <h1 className="text-sm text-gray-500">Opportunity</h1>
          <h1 className="font-bold text-2xl text-gray-900">{opp.name}</h1>
        </div>
        <OppStagePipeline opp={opp} />
        <DropdownMenu>
          <DropdownMenuTrigger className="mt-5" asChild>
            <ThreeDotsButton />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DeleteOppMenuItem id={opp.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <OppStageChecklist opp={opp} />
      <PageSection>
        <OppOverview opp={opp} />
      </PageSection>
    </MainPageWrapper>
  );
};

export default OppMain;
