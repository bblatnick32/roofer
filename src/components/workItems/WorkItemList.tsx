"use client";
import { trpc } from "@/lib/trpc/client";
import WorkItemModal from "./WorkItemModal";
import { CompleteWorkItemForList } from "@/lib/db/schema/workItems";
import { CompleteIssueTemplate, CompleteRepairTemplate } from "@/lib/db";

export default function WorkItemList({
  workItems,
  opportunityId,
  issueTemplates,
  repairTemplates,
}: {
  workItems: CompleteWorkItemForList[];
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) {
  const { data: w } = trpc.workItems.getWorkItemsByOpportunityId.useQuery(
    { oppId: opportunityId },
    {
      initialData: { workItems },
      refetchOnMount: false,
    }
  );

  if (w.workItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {w.workItems.map((workItem) => (
        <WorkItem
          workItem={workItem}
          key={workItem.id}
          opportunityId={opportunityId}
          issueTemplates={issueTemplates}
          repairTemplates={repairTemplates}
        />
      ))}
    </ul>
  );
}

const WorkItem = ({
  workItem,
  opportunityId,
  issueTemplates,
  repairTemplates,
}: {
  workItem: CompleteWorkItemForList;
  opportunityId: number;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
}) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{workItem?.issueTemplate?.name ?? "No issue set"}</div>
      </div>
      <WorkItemModal
        workItem={workItem}
        opportunityId={opportunityId}
        issueTemplates={issueTemplates}
        repairTemplates={repairTemplates}
        photo={workItem.photo}
      />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No work items
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new work item.
      </p>
    </div>
  );
};
