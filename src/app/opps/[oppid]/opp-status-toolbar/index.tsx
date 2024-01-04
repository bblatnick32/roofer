import { Opp, OppStages } from "@/lib/db";
import LeadStatusButtons from "./lead-status-buttons";
import InspectionStatusButtons from "./inspection-status-buttons";
import ProposalStatusButtons from "./proposal-status-buttons";
import ProposalReviewStatusButtons from "./proposal-review-buttons";

const OppStatusToolbar = ({ opp }: { opp: Opp }) => {
  const stage = opp.stage;
  const status = opp.status;

  return (
    <div className="flex gap-2">
      {stage === OppStages.LEAD && <LeadStatusButtons />}
      {stage === OppStages.INSPECTION && <InspectionStatusButtons />}
      {stage === OppStages.PROPOSAL && <ProposalStatusButtons />}
      {stage === OppStages.PROPOSAL_REVIEW && <ProposalReviewStatusButtons />}
    </div>
  );
};

export default OppStatusToolbar;
