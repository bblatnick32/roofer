"use client";
import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { Job, UpdateJobParams, JobStages } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StagePipeline from "@/components/ui/stage-pipeline";

const stages = Object.values(JobStages);
type Stage = (typeof stages)[number];

const JobStagePipeline = ({ job }: { job: Job }) => {
  const [currentStage, setCurrentStage] = useState(job.stage as Stage);
  const router = useRouter();

  const onSuccess = async (action: "update" | "convert") => {
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

  const handleOnClick = (stage: Stage) => {
    setCurrentStage(stage);
    updateJob({ ...(job as UpdateJobParams), stage });
  };

  return (
    <>
      <StagePipeline<Stage>
        stages={stages}
        currentStage={currentStage}
        onClick={handleOnClick}
      />
    </>
  );
};

export default JobStagePipeline;
