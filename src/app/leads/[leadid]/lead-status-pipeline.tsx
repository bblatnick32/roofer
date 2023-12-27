"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { Lead, LeadStatuses, UpdateLeadParams } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusPipeline from "@/components/ui/status-pipeline";
import { ConvertLeadModal } from "@/components/leads/convert-lead-modal";

const statuses = Array.from(LeadStatuses);
type Status = (typeof statuses)[number];

const LeadStatusPipeline = ({ lead }: { lead: Lead }) => {
  const [currentStatus, setCurrentStatus] = useState(lead.status);
  const router = useRouter();
  const utils = trpc.useUtils();

  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const onSuccess = async (action: "update" | "convert") => {
    if (action === "convert") {
      await utils.companies.getCompanies.invalidate();
      utils.companies.getCompanies.prefetch();

      await utils.contacts.getContacts.invalidate();
      utils.contacts.getContacts.prefetch();

      await utils.opportunities.getOpportunities.invalidate();
      utils.opportunities.getOpportunities.prefetch();

      await utils.properties.getProperties.invalidate();
      utils.properties.getProperties.prefetch();
    }

    router.refresh();
    toast({
      title: "Success",
      description: action === "update" ? "Lead updated!" : "Lead converted!",
      variant: "default",
    });
  };

  const { mutate: updateLead } = trpc.leads.updateLead.useMutation({
    onSuccess: async () => onSuccess("update"),
  });

  const handleOnClick = (status: Status) => {
    if (status === "Converted") {
      setConvertModalOpen(true);
      return;
    }

    setCurrentStatus(status);
    updateLead({ ...(lead as UpdateLeadParams), status });
  };

  const handleConvertModalOnOpenChange = (
    open: boolean,
    shouldConvert?: boolean
  ) => {
    setConvertModalOpen(open);
    if (shouldConvert) {
      setCurrentStatus("Converted");
      // convertLead({ ...(lead as UpdateLeadParams), status: "Converted" });
    }
  };

  return (
    <>
      <StatusPipeline<Status>
        statuses={statuses}
        currentStatus={currentStatus}
        onClick={handleOnClick}
      />
      <ConvertLeadModal
        open={convertModalOpen}
        onOpenChange={handleConvertModalOnOpenChange}
      />
    </>
  );
};

export default LeadStatusPipeline;
