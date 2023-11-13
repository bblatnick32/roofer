"use client";
import { CompleteWorkItem } from "@/lib/db/schema/workItems";
import { trpc } from "@/lib/trpc/client";
import WorkItemModal from "./WorkItemModal";


export default function WorkItemList({ workItems }: { workItems: CompleteWorkItem[] }) {
  const { data: w } = trpc.workItems.getWorkItems.useQuery(undefined, {
    initialData: { workItems },
    refetchOnMount: false,
  });

  if (w.workItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {w.workItems.map((workItem) => (
        <WorkItem workItem={workItem} key={workItem.id} />
      ))}
    </ul>
  );
}

const WorkItem = ({ workItem }: { workItem: CompleteWorkItem }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{workItem.oppId}</div>
      </div>
      <WorkItemModal workItem={workItem} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No work items</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new work item.
      </p>
      <div className="mt-6">
        <WorkItemModal emptyState={true} />
      </div>
    </div>
  );
};

