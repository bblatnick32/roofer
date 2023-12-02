import { CompleteLead, LeadStatuses } from "@/lib/db";
import MainPageWrapper from "@/components/main-page-wrapper";
import StatusPipeline from "@/components/ui/status-pipeline";

const statuses = LeadStatuses;

const LeadDetails = ({ lead }: { lead: CompleteLead }) => {
  return (
    <MainPageWrapper>
      <div className="flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <div>
          <h1 className="text-md text-gray-500">Lead</h1>
          <h1 className="mb-3 font-bold text-5xl text-gray-900">{lead.name}</h1>
        </div>
      </div>
      <StatusPipeline
        lead={lead}
        statuses={Array.from(statuses)}
        currentStatus={lead.status}
      />
    </MainPageWrapper>
  );
};

export default LeadDetails;
