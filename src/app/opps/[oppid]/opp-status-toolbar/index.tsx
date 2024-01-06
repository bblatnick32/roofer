import { Opp } from "@/lib/db";
import { CheckListItems } from "@/components/check-list-items";

const OppStatusToolbar = ({ opp }: { opp: Opp }) => {
  const stage = opp.stage;
  const status = opp.status;

  return (
    // <div className="flex gap-2">
    //   {stage === OppStages.LEAD && <LeadStatusButtons />}
    //   {stage === OppStages.INSPECTION && <InspectionStatusButtons />}
    //   {stage === OppStages.PROPOSAL && <ProposalStatusButtons />}
    //   {stage === OppStages.PROPOSAL_REVIEW && <ProposalReviewStatusButtons />}
    // </div>
    <CheckListItems />
  );
};

export default OppStatusToolbar;
