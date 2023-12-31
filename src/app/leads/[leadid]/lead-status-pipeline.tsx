"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import {
  CONVERTED_TO_OPPORTUNITY,
  Lead,
  LeadStatuses,
  UpdateLeadParams,
} from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusPipeline from "@/components/ui/status-pipeline";
// import { ConvertLeadModal } from "@/components/leads/convert-lead-modal";

const statuses = Array.from(LeadStatuses);
type Status = (typeof statuses)[number];

const LeadStatusPipeline = ({ lead }: { lead: Lead }) => {
  const [currentStatus, setCurrentStatus] = useState(lead.status as Status);
  const router = useRouter();
  const utils = trpc.useUtils();

  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const onSuccess = async (action: "update" | "convert") => {
    if (action === "convert") {
      // do something on convert
    }

    router.refresh();
    toast({
      title: "Success",
      description: action === "update" ? "Lead updated!" : "Lead converted!",
      variant: "default",
    });
  };

  const { mutate: updateLead } = trpc.jobs.updateLead.useMutation({
    onSuccess: async () => onSuccess("update"),
  });

  const handleOnClick = (status: Status) => {
    if (status === CONVERTED_TO_OPPORTUNITY) {
      setConvertModalOpen(true);
      return;
    }

    setCurrentStatus(status);
    updateLead({ ...(lead as UpdateLeadParams), status });
  };

  // const handleConvertModalOnOpenChange = (
  //   open: boolean,
  //   shouldConvert?: boolean
  // ) => {
  //   setConvertModalOpen(open);
  //   if (shouldConvert) {
  //     setCurrentStatus("Converted");
  //     // convertLead({ ...(lead as UpdateLeadParams), status: "Converted" });
  //   }
  // };

  return (
    <>
      <StatusPipeline<Status>
        statuses={statuses}
        currentStatus={currentStatus}
        onClick={handleOnClick}
      />
      {/* <ConvertLeadModal
        open={convertModalOpen}
        onOpenChange={handleConvertModalOnOpenChange}
      /> */}
    </>
  );
};

export default LeadStatusPipeline;
