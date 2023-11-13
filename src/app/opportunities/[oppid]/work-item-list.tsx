"use client";

import { CompleteWorkItem } from "@/lib/db/schema/workItems";
import { trpc } from "@/lib/trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const WorkItemList = ({
  workItems,
  opportunityId,
}: {
  workItems: CompleteWorkItem[];
  opportunityId: number;
}) => {
  const [currentlyDeletingWorkItem, setCurrentlyDeletingWorkItem] = useState<
    number | null
  >(null);

  // trpc
  const utils = trpc.useUtils();
  const { data: w, isLoading } =
    trpc.workItems.getWorkItemsByOpportunityId.useQuery(
      { oppId: opportunityId },
      {
        initialData: { workItems },
        refetchOnMount: false,
      }
    );
  const { mutate: deleteWorkItem } = trpc.workItems.deleteWorkItem.useMutation({
    onSuccess: async () => {
      await utils.workItems.getWorkItemsByOpportunityId.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingWorkItem(id);
    },
    onSettled: () => {
      setCurrentlyDeletingWorkItem(null);
    },
  });

  return (
    <main>
      {/* display all opp workItems */}
      {w?.workItems && w?.workItems?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {w?.workItems
            .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
            .map((workItem) => (
              <li
                key={workItem.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/opportunities/work-items/${workItem.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {workItem.id}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(workItem.createdAt!, "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteWorkItem({ id: workItem.id })}
                  >
                    {currentlyDeletingWorkItem === workItem.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s create your first work item.</p>
        </div>
      )}
    </main>
  );
};

export default WorkItemList;
