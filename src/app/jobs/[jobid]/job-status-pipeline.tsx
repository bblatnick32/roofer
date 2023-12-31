"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { Job, JobStatuses, UpdateJobParams } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusPipeline from "@/components/ui/status-pipeline";
// import { ConvertJobModal } from "@/components/jobs/convert-job-modal";

const statuses = Array.from(JobStatuses);
type Status = (typeof statuses)[number];

const JobStatusPipeline = ({ job }: { job: Job }) => {
  const [currentStatus, setCurrentStatus] = useState(job.status as Status);
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
      description: action === "update" ? "Job updated!" : "Job converted!",
      variant: "default",
    });
  };

  const { mutate: updateJob } = trpc.jobs.updateJob.useMutation({
    onSuccess: async () => onSuccess("update"),
  });

  const handleOnClick = (status: Status) => {
    // if (status === CONVERTED_TO_OPPORTUNITY) {
    //   setConvertModalOpen(true);
    //   return;
    // }

    setCurrentStatus(status);
    updateJob({ ...(job as UpdateJobParams), status });
  };

  // const handleConvertModalOnOpenChange = (
  //   open: boolean,
  //   shouldConvert?: boolean
  // ) => {
  //   setConvertModalOpen(open);
  //   if (shouldConvert) {
  //     setCurrentStatus("Converted");
  //     // convertJob({ ...(job as UpdateJobParams), status: "Converted" });
  //   }
  // };

  return (
    <>
      <StatusPipeline<Status>
        statuses={statuses}
        currentStatus={currentStatus}
        onClick={handleOnClick}
      />
      {/* <ConvertJobModal
        open={convertModalOpen}
        onOpenChange={handleConvertModalOnOpenChange}
      /> */}
    </>
  );
};

export default JobStatusPipeline;
