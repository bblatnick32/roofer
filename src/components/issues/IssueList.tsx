"use client";
import { trpc } from "@/lib/trpc/client";
import IssueModal from "./IssueModal";
import { CompleteIssueForList } from "@/lib/db/schema/issues";
import { CompleteIssueTemplate, CompleteRepairTemplate } from "@/lib/db";

export default function IssueList({
  issues,
  opportunityId,
  issueTemplates,
  repairTemplates,
}: {
  issues: CompleteIssueForList[];
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) {
  const { data: w } = trpc.issues.getIssuesByOpportunityId.useQuery(
    { oppId: opportunityId },
    {
      initialData: { issues },
    }
  );

  if (w.issues.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {w.issues.map((issue) => (
        <Issue
          issue={issue}
          key={issue.id}
          opportunityId={opportunityId}
          issueTemplates={issueTemplates}
          repairTemplates={repairTemplates}
        />
      ))}
    </ul>
  );
}

const Issue = ({
  issue,
  opportunityId,
  issueTemplates,
  repairTemplates,
}: {
  issue: CompleteIssueForList;
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{issue?.issueTemplate?.name ?? "No issue set"}</div>
      </div>
      <IssueModal
        issue={issue}
        opportunityId={opportunityId}
        issueTemplates={issueTemplates}
        repairTemplates={repairTemplates}
        photo={issue.photo}
      />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No issues</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new issue.
      </p>
    </div>
  );
};
