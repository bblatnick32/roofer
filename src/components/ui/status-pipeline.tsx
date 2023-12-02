"use client";

import { trpc } from "@/lib/trpc/client";
import Stage from "./stage";
import { toast } from "./use-toast";
import { Lead, LeadStatuses, UpdateLeadParams } from "@/lib/db";
import { useRouter } from "next/navigation";

const statuses = Array.from(LeadStatuses);

const StatusPipeline = ({ lead }: { lead: Lead }) => {
  let found = false;
  const currentStatus = lead.status;

  const router = useRouter();
  const utils = trpc.useUtils();

  const onSuccess = async (action: "update") => {
    await utils.leads.getLeads.invalidate();
    router.refresh();
    toast({
      title: "Success",
      description: `Lead ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: updateLead } = trpc.leads.updateLead.useMutation({
    onSuccess: async () => onSuccess("update"),
  });

  const handleOnClick = (
    status: "New" | "Contacted" | "Closed - Not Converted" | "Converted"
  ) => {
    updateLead({ ...(lead as UpdateLeadParams), status });
  };

  return (
    <div aria-label="Progress">
      <ul role="list" className="rounded-md flex items-start overflow-hidden">
        {statuses.map((status, statusIdx) => {
          if (status === currentStatus) found = true;
          return (
            <li key={status} className="ml-0 pl-1 relative flex-1 mr-1">
              {found === false ? (
                <Stage
                  className="bg-green-600 hover:bg-green-500 before:bg-green-600 after:border-l-green-600 hover:after:border-l-green-500 hover:before:bg-green-500"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => handleOnClick(status)}
                >
                  {status}
                </Stage>
              ) : status === currentStatus ? (
                <Stage
                  className="before:bg-primary after:border-l-primary hover:bg-primary"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => handleOnClick(status)}
                >
                  {status}
                </Stage>
              ) : (
                <Stage
                  className="before:bg-secondary after:border-l-secondary hover:after:border-l-gray-300 hover:before:bg-gray-300"
                  variant="secondary"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => handleOnClick(status)}
                >
                  {status}
                </Stage>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatusPipeline;
