"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { Lead, LeadStatuses, UpdateLeadParams } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusPipeline from "@/components/ui/status-pipeline";

const statuses = Array.from(LeadStatuses);
type Status = (typeof statuses)[number];

const LeadStatusPipeline = ({ lead }: { lead: Lead }) => {
  const [currentStatus, setCurrentStatus] = useState(lead.status);
  const router = useRouter();
  const utils = trpc.useUtils();

  const onSuccess = async (action: "update" | "convert") => {
    if (action === "convert") {
      await utils.companies.getCompanies.invalidate();
      await utils.contacts.getContacts.invalidate();
      await utils.opportunities.getOpportunities.invalidate();
      await utils.properties.getProperties.invalidate();
    }

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

  const { mutate: convertLead } = trpc.leads.convertLead.useMutation({
    onSuccess: async () => onSuccess("convert"),
  });

  const handleOnClick = (status: Status) => {
    setCurrentStatus(status);
    if (status === "Converted") {
      convertLead({ ...(lead as UpdateLeadParams), status });
      return;
    }
    updateLead({ ...(lead as UpdateLeadParams), status });
  };

  return (
    <StatusPipeline<Status>
      statuses={statuses}
      currentStatus={currentStatus}
      onClick={handleOnClick}
    />
  );
};

export default LeadStatusPipeline;
