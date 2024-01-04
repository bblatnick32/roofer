import { Job, JobStages } from "@/lib/db";
import LeadStatusButtons from "./lead-status-buttons";
import InspectionStatusButtons from "./inspection-status-buttons";
import ProposalStatusButtons from "./proposal-status-buttons";
import ProposalReviewStatusButtons from "./proposal-review-buttons";

const JobStatusToolbar = ({ job }: { job: Job }) => {
  const stage = job.stage;
  const status = job.status;

  return (
    <div className="flex gap-2">
      {stage === JobStages.LEAD && <LeadStatusButtons />}
      {stage === JobStages.INSPECTION && <InspectionStatusButtons />}
      {stage === JobStages.PROPOSAL && <ProposalStatusButtons />}
      {stage === JobStages.PROPOSAL_REVIEW && <ProposalReviewStatusButtons />}
    </div>
  );
};

export default JobStatusToolbar;
